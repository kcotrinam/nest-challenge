import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({ description: 'The user id' })
  @ApiProperty({ example: 1 })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  likeId: number;
  @ApiProperty({ description: 'The product id' })
  @ApiProperty({ example: 1 })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
