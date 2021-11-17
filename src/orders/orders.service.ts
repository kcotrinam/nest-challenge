import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { paginatedHelper } from '../pagination/pagination.helper';
import { paginationSerializer } from '../pagination/serializer';
import { PrismaService } from '../prisma/prisma.service';
import { errorMessage } from '../utils/error-message-constructor';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { OrderDto } from './dto/response/order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationQuery: PaginationQueryDto, userRole: boolean) {
    const { page, perPage } = paginationQuery;
    const { skip, take } = paginatedHelper(paginationQuery);

    if (!userRole) {
      throw new HttpException(
        errorMessage(HttpStatus.FORBIDDEN, 'YOU ARE NOT AUTHORIZED'),
        HttpStatus.FORBIDDEN,
      );
    }

    const total = await this.prisma.order.count();
    const orders = await this.prisma.order.findMany({
      skip,
      take,
    });

    const pageInfo = paginationSerializer(total, { page, perPage });

    return { pageInfo, data: plainToClass(OrderDto, orders) };
  }

  async findOwnOrders(paginationQuery: PaginationQueryDto, userId: number) {
    const { page, perPage } = paginationQuery;
    const { skip, take } = paginatedHelper(paginationQuery);

    const total = await this.prisma.order.count();
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      skip,
      take,
    });

    const pageInfo = paginationSerializer(total, { page, perPage });

    return plainToClass(OrderDto, orders);
  }

  async create(userId: number, order: CreateOrderDto) {
    const createdOrder = await this.prisma.order.create({
      data: {
        ...order,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return plainToClass(OrderDto, createdOrder);
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    return plainToClass(OrderDto, order);
  }

  async update(
    id: number,
    currentUser: number,
    input: UpdateOrderDto,
  ): Promise<OrderDto> {
    const order = await this.prisma.order.count({
      where: {
        id,
        userId: currentUser,
      },
    });

    if (!order) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'ORDER NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { ...input },
    });

    return plainToClass(OrderDto, updatedOrder);
  }

  async delete(id: number, userId: number) {
    const order = await this.prisma.order.count({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'ORDER NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    const deletedOrder = await this.prisma.order.delete({ where: { id } });
    return deletedOrder;
  }
}
