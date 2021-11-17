import { Module } from '@nestjs/common';
import { OrderProductsService } from './order-products.service';
import { OrderProductsController } from './order-products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { AttachmentService } from '../attachment/attachment.service';
import { OrderProductResolver } from './resolvers/order-products.resolver';

@Module({
  controllers: [OrderProductsController],
  providers: [
    OrderProductsService,
    PrismaService,
    OrdersService,
    ProductsService,
    AttachmentService,
    OrderProductResolver,
  ],
  exports: [OrderProductsService, OrderProductResolver],
})
export class OrderProductsModule {}
