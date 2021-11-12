import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ defaultValue: false })
  isDisabled: boolean;

  @Field()
  price: number;

  @Field({ defaultValue: 0 })
  likeCounter: number;

  @Field({ defaultValue: 0 })
  stock: number;

  @Field()
  image: string;

  @Field()
  categoryId: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
