import { Field, ObjectType } from '@nestjs/graphql';
import { CursorPaginated } from 'src/utils/args/pagination.args';

@ObjectType()
export class OrderModel {
  @Field()
  id: number;

  @Field()
  total: number;

  @Field()
  isPaid: boolean;

  @Field()
  userId: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class PaginatedOrders extends CursorPaginated(OrderModel) {}
