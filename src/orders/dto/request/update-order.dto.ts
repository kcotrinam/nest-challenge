import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsDecimal, IsBoolean, IsOptional } from 'class-validator';

@Exclude()
export class UpdateOrderDto {
  @Expose()
  @IsNotEmpty()
  @IsOptional()
  @IsDecimal()
  readonly total: number;

  @Expose()
  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  readonly isPaid: boolean;
}
