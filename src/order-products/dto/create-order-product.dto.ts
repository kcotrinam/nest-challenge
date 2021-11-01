import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Exclude()
export class CreateOrderProductDto {
  @Expose()
  @IsNotEmpty()
  readonly quantity: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly total: number;
}
