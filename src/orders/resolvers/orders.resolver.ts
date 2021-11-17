import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Mutation, Query, Int } from '@nestjs/graphql';
import { CurrentUser } from '../../auth/decorators/curret-user.decorator';
import { CurrentUserGuard } from '../../auth/guards/curretn-user.guard';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { RolesGuard } from '../../auth/guards/role.guard';
import { OrdersService } from '../orders.service';
import { OrderModel } from '../models/order.model';
import { CreateOrderModel } from '../models/create-order.model';
import { UpdateOrderModel } from '../models/update-order.model';

@Resolver(() => OrderModel)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [OrderModel])
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async orders(
    @CurrentUser() user,
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
  ) {
    const orders = await this.ordersService.findAll(
      {
        page,
        perPage,
      },
      user,
    );
    return orders.data;
  }

  @Mutation(() => OrderModel)
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async createOrder(
    @CurrentUser() user,
    @Args('input') input: CreateOrderModel,
  ) {
    const order = await this.ordersService.create(user.id, input);
    return order;
  }

  @Query(() => [OrderModel])
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async ownOrders(
    @CurrentUser() user,
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
  ) {
    const ownOrders = await this.ordersService.findOwnOrders(
      {
        page,
        perPage,
      },
      user.id,
    );
    return ownOrders;
  }

  @Query(() => OrderModel)
  async order(@Args('id', { type: () => Int }) id: number) {
    const order = await this.ordersService.findOne(id);
    return order;
  }

  @Mutation(() => OrderModel)
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async updateOrder(
    @CurrentUser() user,
    @Args('input') input: UpdateOrderModel,
  ) {
    const updatedOrder = await this.ordersService.update(
      input.id,
      user.id,
      input,
    );
    return updatedOrder;
  }

  @Mutation(() => OrderModel)
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async removeOrder(
    @CurrentUser() user,
    @Args('id', { type: () => Int }) id: number,
  ) {
    console.log(user, id);
    const deletedOrder = await this.ordersService.delete(id, user.id);
    return deletedOrder;
  }
}
