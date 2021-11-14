import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class VerifyEmailInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
