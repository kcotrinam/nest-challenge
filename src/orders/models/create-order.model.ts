import { Field, InputType } from '@nestjs/graphql';
// import { OrderProductModel } from '../../order-products/models/order-products.model';

@InputType()
export class CreateOrderModel {
  @Field()
  user: number;

  @Field()
  isPaid: boolean;

  @Field()
  total: number;

  // @Field((type) => [OrderProductModel])
  // orderItems: OrderProductModel[];
}
