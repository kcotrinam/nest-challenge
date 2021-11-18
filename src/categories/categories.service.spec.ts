import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from './categories.service';
import * as faker from 'faker';
import { CreateCategoryDto } from './dto/create-category.dto';
import { plainToClass } from 'class-transformer';

const fakeCategoryOne = {
  name: faker.commerce.productMaterial(),
};

const fakeCategoryTwo = {
  name: faker.commerce.productMaterial(),
};

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let prismaService: PrismaService;
  let categoryOne;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [CategoriesService, PrismaService],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.clearDatabase();

    categoryOne = await categoriesService.create(
      plainToClass(CreateCategoryDto, fakeCategoryOne),
    );
    await categoriesService.create(
      plainToClass(CreateCategoryDto, fakeCategoryTwo),
    );
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });

  it('should categories services should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = await categoriesService.findAll({
        page: 1,
        perPage: 10,
      });

      expect(categories).toHaveProperty('pageInfo');
      expect(categories).toHaveProperty('data');
      expect(categories.data).toHaveLength(2);
    });

    it('should return three categories', async () => {
      await categoriesService.create(
        plainToClass(CreateCategoryDto, fakeCategoryTwo),
      );
      const categories = await categoriesService.findAll({
        page: 1,
        perPage: 10,
      });

      expect(categories.data).toHaveLength(3);
    });
  });

  describe('findOne', () => {
    it('should return one category', async () => {
      const category = await categoriesService.findOne(categoryOne.id);

      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category.name).toEqual(categoryOne.name);
    });
  });

  describe('create', () => {
    it('should create a category', async () => {
      const category = await categoriesService.create(
        plainToClass(CreateCategoryDto, fakeCategoryTwo),
      );

      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category.name).toEqual(fakeCategoryTwo.name);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updatedCategory = await categoriesService.update(
        categoryOne.id,
        plainToClass(CreateCategoryDto, {
          name: faker.commerce.productMaterial(),
        }),
      );

      expect(updatedCategory).toHaveProperty('id');
      expect(updatedCategory).toHaveProperty('name');
      expect(updatedCategory.name).not.toBe(categoryOne.name);
    });

    it('should not update a category', async () => {
      try {
        await categoriesService.update(
          9999,
          plainToClass(CreateCategoryDto, {
            name: faker.commerce.productMaterial(),
          }),
        );
      } catch (error) {
        expect(error.message).toEqual('No Category found');
        expect(error.status).toEqual(404);
      }
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const deletedCategory = await categoriesService.remove(categoryOne.id);

      expect(deletedCategory).toHaveProperty('id');
      expect(deletedCategory.id).toEqual(categoryOne.id);
    });

    it('should have a length of 1', async () => {
      await categoriesService.remove(categoryOne.id);
      const categories = await categoriesService.findAll({
        page: 1,
        perPage: 10,
      });

      expect(categories.data).toHaveLength(1);
    });

    it('should not delete a category', async () => {
      try {
        await categoriesService.remove(9999);
      } catch (error) {
        expect(error.message).toEqual('No Category found');
        expect(error.status).toEqual(404);
      }
    });
  });
});
