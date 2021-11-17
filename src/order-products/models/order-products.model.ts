import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderProductModel {
  @Field()
  id: number;

  @Field()
  quantity: number;

  @Field()
  total: number;

  @Field()
  orderId: number;

  @Field()
  productId: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
