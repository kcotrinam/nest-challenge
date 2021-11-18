import { Field, ObjectType } from '@nestjs/graphql';
import { CursorPaginated } from '../../utils/args/pagination.args';

@ObjectType()
export class ProductModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  isDisabled: boolean;

  @Field()
  price: number;

  @Field()
  likeCounter: number;

  @Field()
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

@ObjectType()
export class PaginatedProducts extends CursorPaginated(ProductModel) {}
