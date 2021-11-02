import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import jwt = require('jsonwebtoken');
import { errorMessage } from '../utils/error-message-constructor';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(userId: number) {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

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

    return token;
  }

  async verifyToken(token: string) {
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
    // createError(401, 'Wrong authentication token');
    if (decoded.id !== validToken.userId) return decoded.id;

    return decoded.id;
  }
}
