import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentService } from '../attachment/attachment.service';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { OrderProductsService } from './order-products.service';

describe('OrderProductsService', () => {
  let service: OrderProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductsService,
        PrismaService,
        OrdersService,
        ProductsService,
        AttachmentService,
      ],
    }).compile();

    service = module.get<OrderProductsService>(OrderProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
