import { Args, Resolver, Mutation, Query, Int } from '@nestjs/graphql';
import { OrdersService } from '../orders.service';
import { OrderModel } from '../models/order.model';
import { CreateOrderModel } from '../models/create-order.model';
import { UpdateOrderModel } from '../models/update-order.model';

@Resolver(() => OrderModel)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [OrderModel])
  async orders(
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
  ) {
    const orders = await this.ordersService.findAll(
      {
        page,
        perPage,
      },
      true,
    );
    return orders.data;
  }

  @Mutation(() => OrderModel)
  async createOrder(@Args('input') input: CreateOrderModel) {
    const order = await this.ordersService.create(input.user, input);
    return order;
  }

  @Query(() => [OrderModel])
  async ownOrders(
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const ownOrders = await this.ordersService.findOwnOrders(
      {
        page,
        perPage,
      },
      userId,
    );
    return ownOrders;
  }

  @Query(() => OrderModel)
  async order(@Args('id', { type: () => Int }) id: number) {
    const order = await this.ordersService.findOne(id);
    return order;
  }

  @Mutation(() => OrderModel)
  async updateOrder(@Args('input') input: UpdateOrderModel) {
    const updatedOrder = await this.ordersService.update(
      input.id,
      input.userId,
      input,
    );
    return updatedOrder;
  }

  @Mutation(() => OrderModel)
  async removeOrder(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const deletedOrder = await this.ordersService.delete(id, userId);
    return deletedOrder;
  }
}
