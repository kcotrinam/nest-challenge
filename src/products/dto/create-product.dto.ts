import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the Product' })
  @ApiProperty({ example: 'Lenovo Laptop' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly name: string;

  @ApiProperty({ description: 'Product description' })
  @ApiProperty({ example: '14" screen size, 32GB RAM, Best experience' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ description: 'Product image' })
  @ApiProperty({ example: 'url' })
  @Expose()
  @IsString()
  readonly image: string;

  @ApiProperty({
    description: 'Indicates if there is still stock from the item',
  })
  @ApiProperty({ example: 1 })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly stock: number;

  @ApiProperty({ description: 'Item price' })
  @ApiProperty({ example: 15.35 })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({ description: 'Indicates the category that owns the product' })
  @ApiProperty({ example: 1 })
  @Expose()
  readonly categoryId: number;
}
