import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsDecimal, IsBoolean } from 'class-validator';

@Exclude()
export class CreateOrderDto {
  @Expose()
  @IsNotEmpty()
  @IsDecimal()
  readonly total: number;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  readonly isPaid: boolean;
}
