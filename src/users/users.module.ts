import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersResolver } from './resolvers/users.resolver';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UsersResolver],
})
export class UsersModule {}
