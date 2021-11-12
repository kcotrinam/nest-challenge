import { Field, ObjectType } from '@nestjs/graphql';
import { LikeModel } from '../../likes/models/likes.model';
import { OrderModel } from '../../orders/models/orders.model';
import { TokenModel } from '../../tokens/models/tokens.model';

@ObjectType()
export class UserModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field()
  isManager: boolean;

  @Field()
  password: string;

  @Field()
  emailVerificationToken?: string;

  @Field({ nullable: true })
  emailVerifiedAt?: Date;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field((type) => [LikeModel], { nullable: 'items' })
  likes?: LikeModel[];

  @Field((type) => [OrderModel], { nullable: 'items' })
  orders?: OrderModel[];

  @Field((type) => [TokenModel], { nullable: 'items' })
  tokens?: TokenModel[];
}
