import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesResolver } from './resolvers/categories.resolver';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, CategoriesResolver],
  exports: [CategoriesService, CategoriesResolver],
})
export class CategoriesModule {}
