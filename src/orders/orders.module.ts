import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersResolver } from './resolvers/orders.resolver';
import { TokensService } from '../tokens/tokens.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, OrdersResolver, TokensService],
  exports: [OrdersService, OrdersResolver],
})
export class OrdersModule {}
