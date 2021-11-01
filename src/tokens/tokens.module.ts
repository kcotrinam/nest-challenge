import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService, PrismaService],
})
export class TokensModule {}
