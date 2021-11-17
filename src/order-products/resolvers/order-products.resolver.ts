import { Args, Resolver, Mutation, Int } from '@nestjs/graphql';
import { CreateOrderProductModel } from '../models/create-order-product.model';
import { DeleteOrderProductModel } from '../models/delete-order-product.model';
import { OrderProductModel } from '../models/order-products.model';
import { OrderProductsService } from '../order-products.service';

@Resolver(() => OrderProductModel)
export class OrderProductResolver {
  constructor(private readonly orderProductsService: OrderProductsService) {}

  @Mutation(() => OrderProductModel)
  async createOrderProduct(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input') input: CreateOrderProductModel,
  ) {
    const orderProduct = await this.orderProductsService.create(
      input,
      input.order,
      input.product,
      userId,
    );
    return orderProduct;
  }

  @Mutation(() => OrderProductModel)
  async deleteOrderProduct(@Args('input') input: DeleteOrderProductModel) {
    const deletedOrderProduct = await this.orderProductsService.delete(
      input.order,
      input.product,
      input.id,
    );
    return deletedOrderProduct;
  }
}
