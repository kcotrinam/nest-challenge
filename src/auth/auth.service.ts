import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import bcrypt = require('bcrypt');
import crypto = require('crypto');
import { plainToClass } from 'class-transformer';
import { UserDto } from '../users/dtos/response/user.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { SignInDto } from './sign-in.dto';
import { TokensService } from '../tokens/tokens.service';
import { errorMessage } from '../utils/error-message-constructor';

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
      throw new HttpException(
        errorMessage(HttpStatus.UNPROCESSABLE_ENTITY, 'E-mail already taken'),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
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

    if (!user) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'WRONG CREDENTIAL PROVIDED'),
        HttpStatus.NOT_FOUND,
      );
    }

    const IsPasswordValid = await bcrypt.compare(password, user.password);

    if (!IsPasswordValid) {
      throw new HttpException(
        errorMessage(
          HttpStatus.UNPROCESSABLE_ENTITY,
          'WRONG CREDENTIAL PROVIDED',
        ),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const token = await this.tokenService.createToken(user.id);

    return { token, user: plainToClass(UserDto, user) };
  }

  async verifyEmail(input: VerifyEmailDto): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: +input.id },
    });

    if (!user) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'USER NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.emailVerificationToken !== input.token) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_ACCEPTABLE, 'INVALID TOKEN'),
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const verifiedUser = await this.prisma.user.update({
      where: { id: +input.id },
      data: {
        emailVerificationToken: null,
        emailVerifiedAt: new Date(),
      },
    });

    return plainToClass(UserDto, verifiedUser);
  }
}
