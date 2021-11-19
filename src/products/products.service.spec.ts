import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from './products.service';
import { AttachmentService } from '../attachment/attachment.service';
import * as faker from 'faker';
import { CategoriesService } from '../categories/categories.service';
import { HttpException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UpdateProductDto } from './dto/update-product.dto';

const fakeCategoryOne = {
  name: faker.commerce.productName(),
};

const fakeProductOne = {
  name: 'Laptop HP',
  description: 'Best Laptop in the store',
  price: 15.9,
  categoryId: 1,
  stock: 1,
};

const fakeProductTwo = {
  name: 'MACBOOK PRO',
  description: 'THE best Mac, all you need in a single Laptop',
  price: 18.9,
  categoryId: 1,
  stock: 1,
};

describe('ProductsService', () => {
  let productsService: ProductsService;
  let prismaService: PrismaService;
  let categoriesService: CategoriesService;
  let category;
  let ProductOne;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        CategoriesService,
        AttachmentService,
        PrismaService,
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.clearDatabase();

    category = await categoriesService.create(fakeCategoryOne);

    ProductOne = await productsService.create(fakeProductOne, category.id);
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });

  it('should products services should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const product = await productsService.create(fakeProductTwo, category.id);

      expect(product.name).toBe(fakeProductTwo.name);
      expect(product.description).toBe(fakeProductTwo.description);
      expect(product.price).toBe(fakeProductTwo.price);
      expect(product.stock).toBe(fakeProductTwo.stock);
      expect(product.categoryId).toBe(category.id);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = await productsService.findAll({
        page: 1,
        perPage: 10,
      });

      expect(products.data).toHaveLength(1);
    });

    it('should return 2 products', async () => {
      await productsService.create(fakeProductTwo, category.id);
      const products = await productsService.findAll({
        page: 1,
        perPage: 10,
      });

      expect(products.data).toHaveLength(2);
    });
  });

  describe('findDisabled', () => {
    it('should return all disabled products', async () => {
      await productsService.create(
        { ...fakeProductTwo, isDisabled: true },
        category.id,
      );
      const products = await productsService.findDisabled({
        page: 1,
        perPage: 10,
      });

      expect(products.data).toHaveLength(1);
    });

    it('should return an empty array', async () => {
      const products = await productsService.findDisabled({
        page: 1,
        perPage: 10,
      });

      expect(products.data).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const product = await productsService.findOne(ProductOne.id);

      expect(product.name).toBe(fakeProductOne.name);
      expect(product.description).toBe(fakeProductOne.description);
      expect(product.price).toBe(fakeProductOne.price);
      expect(product.stock).toBe(fakeProductOne.stock);
    });

    it('should return undefined', async () => {
      try {
        await productsService.findOne(2);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual('No Product found');
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const product = await productsService.update(
        ProductOne.id,
        plainToClass(UpdateProductDto, { name: 'Laptop HP' }),
      );

      expect(product.data.name).toBe('Laptop HP');
      expect(product.data.description).toBe(fakeProductOne.description);
      expect(product.data.price).toBe(fakeProductOne.price);
      expect(product.data.stock).toBe(fakeProductOne.stock);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      const result = await productsService.remove(ProductOne.id);

      expect(result.id).toBe(ProductOne.id);
    });
  });

  describe('switchAvailability', () => {
    it('should switch availability of a product', async () => {
      const product = await productsService.switchAvailability(ProductOne.id);

      expect(product.isDisabled).toBe(!ProductOne.isDisabled);
    });

    it('should throw an error', async () => {
      try {
        await productsService.switchAvailability(2);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual('No Product found');
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('updateLikes', () => {
    it('should add a like of a product', async () => {
      await productsService.updateLikes(ProductOne.id, 'increase');
      const result = await productsService.findOne(ProductOne.id);

      expect(result.likeCounter).toBe(ProductOne.likeCounter + 1);
    });

    it('should remove a like of a product', async () => {
      await productsService.updateLikes(ProductOne.id, 'increase');
      await productsService.updateLikes(ProductOne.id, 'increase');
      await productsService.updateLikes(ProductOne.id, 'decrease');
      const result = await productsService.findOne(ProductOne.id);

      expect(result.likeCounter).toBe(ProductOne.likeCounter + 1);
    });
  });
});
