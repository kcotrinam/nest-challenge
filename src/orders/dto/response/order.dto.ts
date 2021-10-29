import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderDto {
  @Expose()
  id: number;

  @Expose()
  total: number;

  @Expose()
  isPaid: boolean;
}
