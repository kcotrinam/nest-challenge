import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { errorMessage } from '../utils/error-message-constructor';
import { CreateOrderProductDto } from './dto/create-order-product.dto';

@Injectable()
export class OrderProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrdersService,
    private readonly productService: ProductsService,
  ) {}

  async create(
    input: CreateOrderProductDto,
    orderId: number,
    productId: number,
    userId: number,
  ): Promise<void> {
    const order = await this.orderService.findOne(orderId);
    const product = await this.productService.findOne(productId);

    if (!order || !product) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'ORDER OR PRODUCT NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    if (order.userId !== userId) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'NOT OWNER OF THE ORDER'),
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.orderProduct.create({
      data: {
        ...input,
        order: {
          connect: {
            id: orderId,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });
  }

  async delete(orderId: number, productId: number, id: number): Promise<void> {
    const orderProduct = await this.prisma.orderProduct.findFirst({
      where: {
        order: {
          id: orderId,
        },
        product: {
          id: productId,
        },
      },
    });

    if (!orderProduct) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'NOT PRODUCT FOUND IN YOUR CART'),
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.orderProduct.delete({
      where: {
        id,
      },
    });
  }
}
