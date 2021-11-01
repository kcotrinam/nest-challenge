import { Module } from '@nestjs/common';
import { OrderProductsService } from './order-products.service';
import { OrderProductsController } from './order-products.controller';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { AttachmentService } from 'src/attachment/attachment.service';

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
