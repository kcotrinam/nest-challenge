import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  lastname: string;

  @Expose()
  email: string;

  @Expose()
  emailVerificationToken: string;

  @Expose()
  @Transform(({ value }) => value?.toString())
  readonly emailVerifiedAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toString())
  readonly createdAt: Date;
}
