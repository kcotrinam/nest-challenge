import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authResolver } from './resolvers/auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    TokensService,
    JwtStrategy,
    authResolver,
  ],
  exports: [AuthService],
})
export class AuthModule {}
