import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ defaultValue: true })
  isDisabled: boolean;
}
