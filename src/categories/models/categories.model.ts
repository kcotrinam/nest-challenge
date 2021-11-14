import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductModel } from '../../products/models/products.model';

@ObjectType()
export class CategoryModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field((type) => [ProductModel], { nullable: 'items' })
  products?: ProductModel[];
}
