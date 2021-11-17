import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from './products.service';
import { AttachmentService } from '../attachment/attachment.service';
import { paginationSerializer } from '../pagination/serializer';
import { CategoriesService } from '../categories/categories.service';
import { HttpException } from '@nestjs/common';
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
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });

  it('should products services should be defined', () => {
    expect(productsService).toBeDefined();
  });

  it('should prisma should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should create a product', async () => {
    const category = await categoriesService.create(
      {
        name: '1',
      },
      true,
    );

    const product = await productsService.create(
      fakeProductOne,
      category.id,
      true,
    );
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
  });

  it('should delete a product', async () => {
    const category = await categoriesService.create(
      {
        name: '1',
      },
      true,
    );
    const product = await productsService.create(
      fakeProductOne,
      category.id,
      true,
    );
    await productsService.remove(product.id, true);
    const searchProduct = await productsService.findOne(product.id);
    expect(searchProduct).toBeNull();
  });

  it('should return a product by id', async () => {
    const category = await categoriesService.create(
      {
        name: '1',
      },
      true,
    );
    const product = await productsService.create(
      fakeProductOne,
      category.id,
      true,
    );
    const searchedProduct = await productsService.findOne(product.id);
    expect(product.id).toBe(searchedProduct.id);
  });

  // it('should throw an error if a product does not exists', async () => {
  //   expect(async () => {
  //     await productsService.findOne(9999999);
  //   }).rejects.toThrow(HttpException);
  // });

  it('should throw an error if you are not a manager and try to create a new product', async () => {
    expect(async () => {
      const category = await categoriesService.create(
        {
          name: '1',
        },
        true,
      );
      await productsService.create(fakeProductOne, category.id, false);
    }).rejects.toThrow(HttpException);
  });

  it('should return all products', async () => {
    const products = await productsService.findAll({
      page: 1,
      perPage: 10,
    });

    const paginate = paginationSerializer(1, { page: 1, perPage: 10 });

    expect(paginate).toEqual({
      take: 10,
      skip: 0,
    });
    expect(products).toHaveProperty('pageInfo');
    expect(products).toHaveProperty('data');
  });

  it('should throw an error if a client try to find disabled products', async () => {
    expect(
      await productsService.findDisabled({ page: 1, perPage: 10 }, false),
    ).rejects.toThrow(HttpException);
  });

  it('should return all disabled products', async () => {
    const products = await productsService.findDisabled(
      {
        page: 1,
        perPage: 10,
      },
      true,
    );

    const paginate = paginationSerializer(1, { page: 1, perPage: 10 });

    expect(paginate).toEqual({
      take: 10,
      skip: 0,
    });
    expect(products).toHaveProperty('pageInfo');
    expect(products).toHaveProperty('data');
  });

  it('should update a product', async () => {
    const category = await categoriesService.create(
      {
        name: '1',
      },
      true,
    );
    const product = await productsService.create(
      fakeProductOne,
      category.id,
      true,
    );
    const updateProduct = await productsService.update(
      product.id,
      fakeProductTwo,
      true,
    );

    expect(updateProduct).toHaveProperty('id');
  });

  it('should update a product', async () => {
    const category = await categoriesService.create(
      {
        name: '1',
      },
      true,
    );
    const product = await productsService.create(
      fakeProductOne,
      category.id,
      true,
    );
    expect(
      await productsService.update(product.id, product, false),
    ).rejects.toThrow(HttpException);
  });

  it('should throw an error if a client try to delete products', async () => {
    expect(await productsService.remove(1, false)).rejects.toThrow(
      HttpException,
    );
  });

  it('should throw an error if try to delete unexisting product', async () => {
    expect(async () => {
      await productsService.remove(9999999, true);
    }).rejects.toThrow(HttpException);
  });

  it('should increase a products like', async () => {
    const category = await categoriesService.create(
      {
        name: '1',
      },
      true,
    );
    const product = await productsService.create(
      fakeProductOne,
      category.id,
      true,
    );
    const likeIncreased = await productsService.updateLikes(
      product.id,
      'increase',
    );
    expect(likeIncreased).toHaveProperty('likeCounter');
  });

  it('should throw an error if a client try to change a product availability', async () => {
    expect(productsService.switchAvailability(1, false)).rejects.toThrow(
      HttpException,
    );
  });

  it('should change a products availability', async () => {
    const category = await categoriesService.create(
      {
        name: '1',
      },
      true,
    );
    const product = await productsService.create(
      fakeProductOne,
      category.id,
      true,
    );
    const currentStatus = product.isDisabled;
    await productsService.switchAvailability(product.id, true);
    expect(product.isDisabled).toBe(!currentStatus);
  });
});
