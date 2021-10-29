import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  isManager: boolean;

  @Expose()
  lastname: string;

  @Expose()
  email: string;
}
