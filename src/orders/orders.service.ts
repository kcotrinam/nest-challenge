import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { OrderDto } from './dto/response/order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<OrderDto[]> {
    return await this.prisma.order.findMany({});
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
