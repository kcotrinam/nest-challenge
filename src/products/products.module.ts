import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma-service/prisma.service';
import { AttachmentService } from '../attachment/attachment.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, AttachmentService],
})
export class ProductsModule {}
