import { Field, ObjectType } from '@nestjs/graphql';
import { ProductModel } from '../../products/models/products.model';

@ObjectType()
export class CategoryModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field((type) => [ProductModel], { nullable: 'items' })
  products?: ProductModel[];
}
