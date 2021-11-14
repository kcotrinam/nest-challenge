import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { errorMessage } from '../utils/error-message-constructor';
import { ProductsService } from '../products/products.service';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductsService,
  ) {}

  async create(productId: number, userId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'PRODUCT NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    const likeExist = await this.prisma.like.count({
      where: { productId, userId },
    });

    if (likeExist) return;

    const like = await this.prisma.like.create({
      data: {
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
    });

    const likedProduct = await this.productService.updateLikes(
      productId,
      'increase',
    );
    console.log(like, likedProduct);
    return likedProduct;
  }

  async remove(productId: number, userId: number): Promise<void> {
    const likeExist = await this.prisma.like.findFirst({
      where: { productId, userId },
    });

    if (!likeExist) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'LIKE NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.like.delete({
      where: { id: likeExist.id },
    });

    await this.productService.updateLikes(productId, 'decrease');
  }
}
