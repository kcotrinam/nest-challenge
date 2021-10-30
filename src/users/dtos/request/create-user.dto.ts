import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { BaseDto } from '../base.dto';

@Exclude()
export class CreateUserDto extends BaseDto {
  @ApiProperty({ description: 'Name of the User' })
  @ApiProperty({ example: 'Christian' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'User lastname' })
  @ApiProperty({ example: 'Sagastegui' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly lastname: string;

  @ApiProperty({ description: 'User email' })
  @ApiProperty({ example: 'user@mail.com' })
  @Expose()
  @IsString()
  readonly email: string;

  @ApiProperty({ description: 'password' })
  @ApiProperty({ example: 'password123' })
  @Expose()
  @IsNotEmpty()
  @Length(6, 20)
  readonly password: string;
}
