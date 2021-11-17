import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteOrderProductModel {
  @Field()
  id: number;

  @Field()
  order: number;

  @Field()
  product: number;
}
