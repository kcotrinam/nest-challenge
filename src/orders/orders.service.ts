import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { paginatedHelper } from 'src/pagination/pagination.helper';
import { paginationSerializer } from 'src/pagination/serializer';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { OrderDto } from './dto/response/order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page, perPage } = paginationQuery;
    const { skip, take } = paginatedHelper(paginationQuery);
    const total = await this.prisma.order.count();
    const pageInfo = paginationSerializer(total, { page, perPage });
    const orders = await this.prisma.order.findMany({
      skip,
      take,
    });
    return { pageInfo, data: orders };
  }

  async create(order: CreateOrderDto): Promise<OrderDto> {
    const createdOrder = await this.prisma.order.create({ data: order });

    return plainToClass(OrderDto, createdOrder);
  }

  async findOne(id: number): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({ where: { id } });

    return plainToClass(OrderDto, order);
  }

  async update(id: number, order: UpdateOrderDto): Promise<OrderDto> {
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: order,
    });

    return plainToClass(OrderDto, updatedOrder);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.order.delete({ where: { id } });
  }
}
