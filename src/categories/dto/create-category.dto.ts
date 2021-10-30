import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the category' })
  @ApiProperty({ example: '1' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly name: string;
}
