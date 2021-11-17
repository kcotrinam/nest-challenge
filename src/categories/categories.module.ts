import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesResolver } from './resolvers/categories.resolver';
import { TokensService } from '../tokens/tokens.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    PrismaService,
    CategoriesResolver,
    TokensService,
  ],
  exports: [CategoriesService, CategoriesResolver],
})
export class CategoriesModule {}
