import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dtos/request/create-user.dto';
import bcrypt = require('bcrypt');
import crypto = require('crypto');
import { plainToClass } from 'class-transformer';
import { UserDto } from '../users/dtos/response/user.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { TokensService } from '../tokens/tokens.service';
import { errorMessage } from '../utils/error-message-constructor';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokensService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  async signIn(input: SignInDto) {
    const { email, password } = input;
    const user = await this.validateUser(email, password);

    const payload = {
      id: user.id,
      role: user.isManager ? 'MANAGER' : 'USER',
    };

    const token = await this.generateToken(payload);
    console.log(token);

    return { accessToken: token };
  }

  async verifyEmail(input: VerifyEmailDto): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: +input.id },
    });

    if (!user) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'WRONG CREDENTIALS PROVIDED'),
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

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'WRONG CREDENTIAL PROVIDED'),
        HttpStatus.NOT_FOUND,
      );
    }

    await this.validatePassword(password, user.password);

    return user;
  }

  async validatePassword(password, hashedPassword) {
    const IsPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!IsPasswordValid) {
      throw new HttpException(
        errorMessage(
          HttpStatus.UNPROCESSABLE_ENTITY,
          'WRONG CREDENTIAL PROVIDED',
        ),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  private async generateToken(payload): Promise<string> {
    const token = await this.jwtService.sign(payload);
    // const token = await this.tokenService.createToken();

    return token;
  }
}
