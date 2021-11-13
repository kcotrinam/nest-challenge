import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProductModel {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  readonly image?: string;

  @Field({ nullable: true })
  stock?: number;

  @Field({ nullable: true })
  price?: number;

  @Field()
  readonly id: number;
}
