import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class SigninInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  readonly password: string;
}
