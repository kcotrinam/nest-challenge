import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DetailedProductDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly isDisabled: boolean;

  @Expose()
  readonly image: string;

  @Expose()
  readonly stock: number;

  @Expose()
  readonly price: number;
}
