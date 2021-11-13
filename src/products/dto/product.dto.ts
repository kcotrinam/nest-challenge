import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly likeCounter: number;

  @Expose()
  readonly description: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly image: string;

  @Expose()
  readonly stock: number;

  @Expose()
  readonly price: number;

  @Expose()
  readonly categoryId: number;

  @Expose()
  readonly isDisabled: boolean;
}
