import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { OrderProductsService } from './order-products.service';

describe('OrderProductsService', () => {
  let service: OrderProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderProductsService, PrismaService],
    }).compile();

    service = module.get<OrderProductsService>(OrderProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
