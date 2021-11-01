import { Module } from '@nestjs/common';
import { OrderProductsService } from './order-products.service';
import { OrderProductsController } from './order-products.controller';
<<<<<<< HEAD
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { AttachmentService } from 'src/attachment/attachment.service';
=======
import { PrismaService } from '../prisma-service/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { AttachmentService } from '../attachment/attachment.service';
>>>>>>> categories_test

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
