import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @Expose()
  @IsNumber()
  // @IsNotEmpty()
  readonly id: number;

  @Expose()
  @IsString()
  // @IsNotEmpty()
  @Length(1, 100)
  readonly name: string;
}
