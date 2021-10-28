import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma.service';
import jwt = require('jsonwebtoken');

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
}
