import { Field, ObjectType } from '@nestjs/graphql';
// import { ProductModel } from '../../products/models/products.model';
// import { UserModel } from '../../users/models/users.model';

@ObjectType()
export class LikeModel {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
