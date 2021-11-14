import { Field, InputType } from '@nestjs/graphql';
// import { ProductModel } from '../../products/models/products.model';
// import { UserModel } from '../../users/models/users.model';

@InputType()
export class CreateLikeModel {
  @Field()
  productId: number;

  @Field()
  userId: number;
}
