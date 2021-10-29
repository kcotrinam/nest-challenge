import { Expose, Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class VerifyEmailDto {
  @Expose()
  @IsString()
  readonly id: string;

  @Expose()
  @IsString()
  readonly token: string;
}
