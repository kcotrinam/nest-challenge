import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class TokenModel {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly accessToken: string;
}
