import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateProductDto {
  @Expose()
  readonly id: number;

  @Expose()
  name?: string;

  @Expose()
  description?: string;

  @Expose()
  isDisabled?: boolean;

  @Expose()
  image?: string;

  @Expose()
  stock?: number;

  @Expose()
  price?: number;

  @Expose()
  categoryId?: number;

  @Expose()
  readonly createdAt?: Date;

  @Expose()
  readonly updatedAt?: Date;
}
