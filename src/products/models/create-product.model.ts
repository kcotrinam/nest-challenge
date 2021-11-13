import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductModel {
  @Field()
  readonly name: string;

  @Field({ nullable: true })
  readonly description?: string;

  @Field({ nullable: true })
  readonly image?: string;

  @Field()
  readonly stock: number;

  @Field()
  readonly price: number;

  @Field({ nullable: true })
  readonly isDisabled?: boolean;
}
