import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrderProductModel {
  @Field()
  quantity: number;

  // @Field()
  // total: number;

  @Field()
  order: number;

  @Field()
  product: number;
}
