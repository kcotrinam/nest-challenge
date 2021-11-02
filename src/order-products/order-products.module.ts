import { Module } from '@nestjs/common';
import { OrderProductsService } from './order-products.service';
import { OrderProductsController } from './order-products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { AttachmentService } from '../attachment/attachment.service';

@Module({
  controllers: [OrderProductsController],
  providers: [
    OrderProductsService,
    PrismaService,
    OrdersService,
    ProductsService,
    AttachmentService,
  ],
})
export class OrderProductsModule {}
