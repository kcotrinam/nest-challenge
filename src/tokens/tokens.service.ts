import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma.service';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

const secret = 'secret';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(userId: number) {
    const token = jwt.sign({ id: userId }, secret, {
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
    const decoded = jwt.verify(token, secret);

    const validToken = await this.prisma.token.findFirst({
      where: { jti: token },
    });

    if (!validToken) createError(401, 'Wrong authentication token');
    if (decoded.id !== validToken.userId) return decoded.id;

    return decoded.id;
  }
}
