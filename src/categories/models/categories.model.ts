import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductModel } from '../../products/models/products.model';

@ObjectType()
export class CategoryModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  updatedAt?: string;

  @Field(() => [ProductModel])
  products: ProductModel[];
}
