import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryModel {
  @Field()
  readonly name: string;
}
