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
  @Transform(({ value }) => value?.toString())
  readonly createdAt: Date;
}
