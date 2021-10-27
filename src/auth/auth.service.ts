import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import bcrypt = require('bcrypt');
import crypto = require('crypto');
import createError from 'http-errors';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(input: CreateUserDto) {
    if (
      await this.prisma.user.count({
        where: { email: input.email },
      })
    ) {
      throw new createError.UnprocessableEntity('email already taken');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const emailVerificationToken = crypto.randomBytes(12).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
        emailVerificationToken,
      },
    });

    return plainToClass(UserDto, user);
  }

  async verifyEmail(input: VerifyEmailDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: +input.id },
    });

    if (!user) throw createError(404, 'User not found');
    if (user.emailVerificationToken !== input.token) {
      throw createError(400, 'Invalid token');
    }

    await this.prisma.user.update({
      where: { id: +input.id },
      data: {
        emailVerificationToken: null,
        emailVerifiedAt: new Date(),
      },
    });
  }
}
