import { Field, InputType } from '@nestjs/graphql';
// import { OrderProductModel } from '../../order-products/models/order-products.model';

@InputType()
export class UpdateOrderModel {
  @Field()
  id: number;

  @Field()
  userId: number;

  @Field({ nullable: true })
  total?: number;

  @Field({ nullable: true })
  isPaid?: boolean;
  // @Field((type) => [OrderProductModel])
  // orderItems: OrderProductModel[];
}
