import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { UserDto } from './dtos/response/user.dto';
import createError from 'http-errors';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { paginatedHelper } from 'src/pagination/pagination.helper';
import { paginationSerializer } from 'src/pagination/serializer';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page, perPage } = paginationQuery;
    const { skip, take } = paginatedHelper(paginationQuery);
    const total = await this.prisma.user.count();
    const pageInfo = paginationSerializer(total, { page, perPage });
    const users = await this.prisma.user.findMany({
      skip,
      take,
    });
    return { pageInfo, data: users };
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new createError.NotFound(`User ${id} not found`);
    }

    return plainToClass(UserDto, user);
  }
}
