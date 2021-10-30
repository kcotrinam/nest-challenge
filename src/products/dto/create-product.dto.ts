import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateProductDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @Expose()
  @IsString()
  readonly image?: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly stock: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @Expose()
  readonly categoryId: number;
}
