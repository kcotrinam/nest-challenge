import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { TokensService } from 'src/tokens/tokens.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TokensService],
})
export class AuthModule {}
