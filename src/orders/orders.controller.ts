import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}
  @Get('accounts/me/orders')
  async findOwnOrders(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(20), ParseIntPipe) perPage: number,
    @Res() res,
    @Req() req,
  ) {
    // console.log(req.currentUser);
    const orders = await this.orderService.findOwnOrders(
      {
        page,
        perPage,
      },
      +req.currentUser,
    );

    res.status(200).json(orders);
  }

  @Get('accounts/:userId/orders')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(20), ParseIntPipe) perPage: number,
    @Res() res,
    @Req() req,
    @Param('userId') userId: string,
  ) {
    const userLoggedRole = req.currentUserRole;
    const orders = await this.orderService.findAll(
      {
        page,
        perPage,
      },
      userLoggedRole,
      +userId,
    );

    res.status(200).json(orders);
  }

  @Post('accounts/me/orders')
  async create(@Req() req, @Body() orderInfo, @Res() res) {
    const dto = plainToClass(CreateOrderDto, orderInfo);
    const newOrder = await this.orderService.create(+req.currentUser, dto);

    return res.status(201).json(newOrder);
  }

  @Get('orders/:id')
  async findOne(@Param('id') id: string, @Res() res) {
    const order = await this.orderService.findOne(+id);

    return res.status(200).json(order);
  }

  @Patch('accounts/me/orders/:id')
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() orderInfo,
    @Res() res,
  ) {
    const loggedUser = req.currentUser;
    const dto = plainToClass(CreateOrderDto, orderInfo);
    const order = await this.orderService.update(+id, loggedUser, dto);

    return res.status(200).json(order);
  }

  @Delete('accounts/me/orders/:id')
  async delete(@Param('id') id: string, @Req() req, @Res() res) {
    await this.orderService.delete(+id, req.currentUser);

    return res.status(204).json();
  }
}
