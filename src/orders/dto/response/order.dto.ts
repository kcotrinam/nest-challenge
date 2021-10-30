import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderDto {
  @ApiProperty({ description: 'Order id' })
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Total price of your order' })
  @ApiProperty({ example: 15.9 })
  @Expose()
  total: number;

  @ApiProperty({ description: 'false when is not paid, true otherwise' })
  @ApiProperty({ example: false })
  @Expose()
  isPaid: boolean;
}
