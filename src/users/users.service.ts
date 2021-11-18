import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dtos/response/user.dto';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { paginatedHelper } from '../pagination/pagination.helper';
import { paginationSerializer } from '../pagination/serializer';
import { errorMessage } from '../utils/error-message-constructor';
import { User } from '.prisma/client';
import { getEdges } from '../utils/args/pagination.args';
import { UserModel } from './models/users.model';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationQuery: PaginationQueryDto, isRestLayer = true) {
    const { page, perPage } = paginationQuery;
    const { skip, take } = paginatedHelper(paginationQuery);
    const total = await this.prisma.user.count();
    const pageInfo = paginationSerializer(total, { page, perPage });
    const users = await this.prisma.user.findMany({
      skip,
      take,
    });

    if (!isRestLayer) {
      const edges = getEdges(plainToClass(UserModel, users));

      return { edges, pageInfo };
    }

    return { data: plainToClass(UserDto, users), pageInfo };
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    return plainToClass(UserDto, user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async switchRole(id: number, userRole: boolean): Promise<UserDto> {
    if (!userRole) {
      throw new HttpException(
        errorMessage(HttpStatus.UNAUTHORIZED, 'NOT AUTHORIZED'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'USER NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    const newRole = user.isManager ? false : true;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isManager: newRole },
    });

    return plainToClass(UserDto, updatedUser);
  }
}
