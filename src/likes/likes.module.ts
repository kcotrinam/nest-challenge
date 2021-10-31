import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { AttachmentService } from 'src/attachment/attachment.service';

@Module({
  controllers: [LikesController],
  providers: [
    LikesService,
    PrismaService,
    UsersService,
    ProductsService,
    AttachmentService,
  ],
})
export class LikesModule {}
