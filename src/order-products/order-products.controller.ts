import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateOrderProductDto } from '../order-products/dto/create-order-product.dto';
import { OrderProductsService } from './order-products.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Orders-Products')
@Controller('orders/:orderId/products/:productId/chart')
export class OrderProductsController {
  constructor(private readonly orderProductService: OrderProductsService) {}

  @Post()
  async create(
    @Param('orderId') orderId: string,
    @Param('productId') productId: string,
    @Res() res,
    @Req() req,
    @Body() body,
  ) {
    const dto = plainToClass(CreateOrderProductDto, body);
    await this.orderProductService.create(
      dto,
      +orderId,
      +productId,
      req.currentUser,
    );

    res.status(200).send('OK');
  }

  @Delete(':id')
  async delete(
    @Param('orderId') orderId: string,
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Res() res,
  ): Promise<void> {
    await this.orderProductService.delete(+orderId, +productId, +id);

    res.status(204).send('OK');
  }
}
