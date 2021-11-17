import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from './categories.service';
import { paginationSerializer } from '../pagination/serializer';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [CategoriesService, PrismaService],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should categories services should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  it('should prisma should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should create a category', async () => {
    const category = await categoriesService.create(
      {
        name: 'choclatey',
      },
      true,
    );
    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('name');
  });

  it('should delete a category', async () => {
    const category = await categoriesService.create(
      {
        name: 'choclatey',
      },
      true,
    );
    await categoriesService.remove(category.id, true);

    expect(category.id).toBe(category.id);
  });

  it('should return a category by id', async () => {
    const category = await categoriesService.create(
      { name: 'choclatey' },
      true,
    );
    const searchedCategory = await categoriesService.findOne(category.id);

    expect(category.id).toBe(searchedCategory.id);
  });

  it('should throw an error if a category does not exists', async () => {
    expect(async () => {
      await categoriesService.findOne(99999);
    }).rejects.toThrow();
  });

  it('should return all categories', async () => {
    const categories = await categoriesService.findAll({
      page: 1,
      perPage: 10,
    });

    expect(categories).toHaveProperty('pageInfo');
    expect(categories).toHaveProperty('data');
  });

  it('should update a category', async () => {
    const category = await prismaService.category.create({
      data: { name: 'choclatey' },
    });
    const updateCategory = await categoriesService.update(category.id, true, {
      name: 'new category',
    });
    expect(updateCategory.id).toBe(category.id);
    expect(updateCategory.name).not.toBe(category.name);
  });
});
