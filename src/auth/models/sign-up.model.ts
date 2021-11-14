import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field()
  readonly name: string;

  @Field()
  readonly lastname: string;

  @Field()
  readonly isManager?: boolean;

  @Field()
  readonly email: string;

  @Field()
  readonly password: string;
}
