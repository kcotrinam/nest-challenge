import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { AttachmentService } from '../attachment/attachment.service';
import { LikesResolver } from './resolvers/likes.resolver';

@Module({
  controllers: [LikesController],
  providers: [
    LikesService,
    PrismaService,
    UsersService,
    ProductsService,
    AttachmentService,
    LikesResolver,
  ],
  exports: [LikesService, LikesResolver],
})
export class LikesModule {}
