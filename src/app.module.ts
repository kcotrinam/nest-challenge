import { PrismaService } from './prisma-service/prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [ProductsModule, CategoriesModule, LikesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
