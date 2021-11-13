import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryModel {
  @Field()
  name?: string;

  @Field()
  readonly id?: number;
}
