import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AttachmentService } from '../attachment/attachment.service';
import { ProductsResolver } from './resolvers/products.resolver';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    AttachmentService,
    ProductsResolver,
  ],
  exports: [ProductsService, ProductsResolver],
})
export class ProductsModule {}
