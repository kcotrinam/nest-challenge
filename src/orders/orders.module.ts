import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
<<<<<<< HEAD
import { PrismaService } from 'src/prisma/prisma.service';
=======
import { PrismaService } from '../prisma-service/prisma.service';
>>>>>>> categories_test

@Module({
  providers: [OrdersService, PrismaService],
  controllers: [OrdersController],
})
export class OrdersModule {}
