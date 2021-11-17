import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Mutation, Int } from '@nestjs/graphql';
import { CurrentUser } from '../../auth/decorators/curret-user.decorator';
import { CurrentUserGuard } from '../../auth/guards/curretn-user.guard';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { RolesGuard } from '../../auth/guards/role.guard';
import { CreateOrderProductModel } from '../models/create-order-product.model';
import { DeleteOrderProductModel } from '../models/delete-order-product.model';
import { OrderProductModel } from '../models/order-products.model';
import { OrderProductsService } from '../order-products.service';

@Resolver(() => OrderProductModel)
export class OrderProductResolver {
  constructor(private readonly orderProductsService: OrderProductsService) {}

  @Mutation(() => OrderProductModel)
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async createOrderProduct(
    @CurrentUser() user,
    @Args('input') input: CreateOrderProductModel,
  ) {
    const orderProduct = await this.orderProductsService.create(
      input,
      input.order,
      input.product,
      user.id,
    );
    return orderProduct;
  }

  @Mutation(() => OrderProductModel)
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async deleteOrderProduct(
    @CurrentUser() user,
    @Args('input') input: DeleteOrderProductModel,
  ) {
    const deletedOrderProduct = await this.orderProductsService.delete(
      input.order,
      input.product,
      user.id,
    );

    return deletedOrderProduct;
  }
}
