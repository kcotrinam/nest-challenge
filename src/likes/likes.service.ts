import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { PrismaService } from 'src/prisma-service/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(productId: number, userId: number) {
    if (!userId) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'You cant like this product',
        },
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      const like = await this.prisma.like.create({
        data: { userId, productId },
      });
      const product = await this.prisma.product.update({
        where: { id: productId },
        data: { likeCounter: { increment: 1 } },
      });
    }
  }

  async remove(id: number, userId: number) {
    if (!userId) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'You cant like this product',
        },
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      return await this.prisma.like.delete({ where: { id } });
    }
  }
}
