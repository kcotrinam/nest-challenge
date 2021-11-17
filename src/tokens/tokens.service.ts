import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import jwt = require('jsonwebtoken');
import { errorMessage } from '../utils/error-message-constructor';
import { decodedToken } from './interfaces/token-verification.interface';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(userId: number, token: string): Promise<void> {
    await this.prisma.token.create({
      data: {
        jti: token,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async verifyToken(token: string): Promise<decodedToken> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const validToken = await this.prisma.token.findFirst({
      where: { jti: token },
    });

    if (!validToken) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'TOKEN NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    return decoded as decodedToken;
  }
}
