import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderProductModel {
  @Field()
  id: string;

  @Field()
  quantity: number;

  @Field()
  total: number;

  @Field()
  orderId: string;

  @Field()
  productId: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
