import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}
  @Get()
  async findAll(@Res() res) {
    const orders = await this.orderService.findAll();

    res.status(200).json(orders);
  }

  @Post()
  async create(@Body() orderInfo, @Res() res) {
    const dto = plainToClass(CreateOrderDto, orderInfo);
    const order = await this.orderService.create(dto);

    return res.status(201).json(order);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string, @Res() res) {
    const order = await this.orderService.findOne(+id);

    return res.status(200).json(order);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() orderInfo, @Res() res) {
    const dto = plainToClass(CreateOrderDto, orderInfo);
    const order = await this.orderService.update(+id, dto);

    return res.status(200).json(order);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @Res() res) {
    await this.orderService.delete(+id);

    return res.status(204).json();
  }
}
