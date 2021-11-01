import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma.service';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import bcrypt = require('bcrypt');
import crypto = require('crypto');
import createError from 'http-errors';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../users/dtos/response/user.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { SignInDto } from './sign-in.dto';
import { TokensService } from '../tokens/tokens.service';

interface signInResponse {
  user: UserDto;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokensService,
  ) {}

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

  async signIn(input: SignInDto): Promise<signInResponse> {
    const { email, password } = input;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw createError(401, 'Wrong credentials provided');

    const IsPasswordValid = await bcrypt.compare(password, user.password);

    if (!IsPasswordValid) throw createError(401, 'Wrong credentials provided');

    const token = await this.tokenService.createToken(user.id);

    return { token, user: plainToClass(UserDto, user) };
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
