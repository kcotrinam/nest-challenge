import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService, PrismaService],
  exports: [TokensService],
})
export class TokensModule {}
