import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CursorPaginated } from '../../utils/args/pagination.args';

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

@ObjectType()
export class PaginatedUsers extends CursorPaginated(UserModel) {}
