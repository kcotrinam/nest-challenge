import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { AttachmentService } from '../attachment/attachment.service';

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
