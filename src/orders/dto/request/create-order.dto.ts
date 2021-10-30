import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsDecimal, IsBoolean } from 'class-validator';

@Exclude()
export class CreateOrderDto {
  @ApiProperty({ description: 'Total price of your order' })
  @ApiProperty({ example: 15.9 })
  @Expose()
  @IsNotEmpty()
  @IsDecimal()
  readonly total: number;

  @ApiProperty({ description: 'false when is not paid, true otherwise' })
  @ApiProperty({ example: false })
  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  readonly isPaid: boolean;
}
