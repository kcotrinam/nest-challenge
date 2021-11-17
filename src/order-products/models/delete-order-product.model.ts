import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteOrderProductModel {
  @Field()
  order: number;

  @Field()
  product: number;
}
