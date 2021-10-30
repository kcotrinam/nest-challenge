import { Expose, Exclude } from 'class-transformer';
// import { IsNotEmpty, IsString, IsDecimal, IsBoolean } from 'class-validator';

@Exclude()
export class AttachmentDto {
  readonly url: string;
  readonly key: string;
}
