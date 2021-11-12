import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field({ nullable: true })
  emailVerifiedAt?: string;

  @Field({ nullable: true })
  emailVerificationToken: string;

  @Field()
  isManager: boolean;

  @Field()
  lastname: string;

  @Field()
  email: string;
}
