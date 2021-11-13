import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt?: Date;
}
