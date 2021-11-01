import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
<<<<<<< HEAD
import { PrismaService } from 'src/prisma/prisma.service';
import { AttachmentService } from 'src/attachment/attachment.service';
=======
import { PrismaService } from '../prisma-service/prisma.service';
import { AttachmentService } from '../attachment/attachment.service';
>>>>>>> categories_test

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, AttachmentService],
})
export class ProductsModule {}
