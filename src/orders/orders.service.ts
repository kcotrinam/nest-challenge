import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { getEdges } from '../utils/args/pagination.args';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { paginatedHelper } from '../pagination/pagination.helper';
import { paginationSerializer } from '../pagination/serializer';
import { PrismaService } from '../prisma/prisma.service';
import { errorMessage } from '../utils/error-message-constructor';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { OrderDto } from './dto/response/order.dto';
import { OrderModel } from './models/order.model';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationQuery: PaginationQueryDto, isRestLayer = true) {
    const { page, perPage } = paginationQuery;
    const { skip, take } = paginatedHelper(paginationQuery);

    const total = await this.prisma.order.count();
    const orders = await this.prisma.order.findMany({
      skip,
      take,
    });

    const pageInfo = paginationSerializer(total, { page, perPage });

    if (!isRestLayer) {
      const edges = getEdges(plainToClass(OrderModel, orders));

      return { edges, pageInfo };
    }

    return { pageInfo, data: plainToClass(OrderDto, orders) };
  }

  async findOwnOrders(
    paginationQuery: PaginationQueryDto,
    userId: number,
    isRestLayer = true,
  ) {
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

    if (!isRestLayer) {
      const edges = getEdges(plainToClass(OrderModel, orders));

      return { edges, pageInfo };
    }

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

  async update(id: number, currentUser: number, input: UpdateOrderDto) {
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

  async findAllOrderProducts(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'ORDER NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }
    const chartList = await this.prisma.orderProduct.findMany({
      where: {
        orderId: id,
      },
    });

    const products = await Promise.all(
      chartList.map(async (chart) => {
        const product = await this.prisma.product.findUnique({
          where: {
            id: chart.productId,
          },
        });
        return product;
      }),
    );

    return products;
  }
}
