import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma.service';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService, PrismaService],
})
export class TokensModule {}
