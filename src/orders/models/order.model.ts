import { Field, ObjectType } from '@nestjs/graphql';
// import { OrderProductModel } from '../../order-products/models/order-products.model';

@ObjectType()
export class OrderModel {
  @Field()
  id: string;

  @Field()
  total: number;

  @Field()
  isPaid: boolean;

  @Field()
  userId: number;

  // @Field((type) => [OrderProductModel])
  // orderItems: OrderProductModel[];

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
