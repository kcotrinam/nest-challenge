import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { paginatedHelper } from 'src/pagination/pagination.helper';
import { paginationSerializer } from 'src/pagination/serializer';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorMessage } from 'src/utils/error-message-constructor';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { OrderDto } from './dto/response/order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    paginationQuery: PaginationQueryDto,
    userRole: boolean,
    userId: number,
  ) {
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
      where: {
        userId,
      },
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

    return { pageInfo, data: plainToClass(OrderDto, orders) };
  }

  async create(userId: number, order: CreateOrderDto): Promise<OrderDto> {
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

  async findOne(id: number): Promise<OrderDto> {
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
      data: input,
    });

    return plainToClass(OrderDto, updatedOrder);
  }

  async delete(id: number, userId: number): Promise<void> {
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
    console.log(order);

    await this.prisma.order.delete({ where: { id } });
  }
}
