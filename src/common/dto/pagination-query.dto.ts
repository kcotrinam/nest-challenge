import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsOptional()
  limit: number;

  @Type(() => Number)
  @IsOptional()
  offset: number;
}
