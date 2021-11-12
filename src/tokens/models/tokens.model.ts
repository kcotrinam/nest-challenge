import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenModel {
  @Field()
  id: string;

  @Field()
  jti: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true })
  ttl?: Date;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;
}
