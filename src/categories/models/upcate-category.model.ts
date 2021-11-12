import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryModel {
  @Field()
  readonly name?: string;

  @Field()
  readonly id?: number;
}
