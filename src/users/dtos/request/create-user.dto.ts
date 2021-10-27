import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';
import { BaseDto } from '../base.dto';
// import { BaseDto } from '../../base.dto';

@Exclude()
export class CreateUserDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly lastname: string;

  @Expose()
  @IsString()
  readonly email: string;

  @Expose()
  @IsNotEmpty()
  @Length(6, 20)
  readonly password: string;
}
