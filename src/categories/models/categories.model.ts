import { Field, ObjectType } from '@nestjs/graphql';
import { ProductModel } from '../../products/models/products.model';

@ObjectType()
export class CategoryModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  updatedAt?: string;

  @Field((type) => [ProductModel])
  products: ProductModel[];
}
