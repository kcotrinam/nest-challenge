import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { UserDto } from './dtos/response/user.dto';
import createError from 'http-errors';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();

    return plainToClass(UserDto, users);
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      console.log(user);
      throw new createError.NotFound(`User ${id} not found`);
    }
    console.log(`outter scope${user}`);

    return plainToClass(UserDto, user);
  }
}
