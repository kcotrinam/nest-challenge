import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authResolver } from './resolvers/auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60h' },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    TokensService,
    JwtStrategy,
    authResolver,
    UsersService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
