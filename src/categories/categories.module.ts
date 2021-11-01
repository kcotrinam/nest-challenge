import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
<<<<<<< HEAD
import { PrismaService } from 'src/prisma/prisma.service';
=======
import { PrismaService } from '../prisma-service/prisma.service';
>>>>>>> categories_test

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
