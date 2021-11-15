import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @Expose()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  readonly password: string;
}
