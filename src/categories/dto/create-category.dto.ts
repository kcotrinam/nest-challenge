import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly name: string;
}
