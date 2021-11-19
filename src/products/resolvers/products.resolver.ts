import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginatedProducts, ProductModel } from '../models/products.model';
import { ProductsService } from '../products.service';
import { CreateProductModel } from '../models/create-product.model';
import { UpdateProductModel } from '../models/update-product.model';

@Resolver(() => ProductModel)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => PaginatedProducts)
  async products(
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
  ) {
    const products = await this.productsService.findAll(
      {
        page,
        perPage,
      },
      false,
    );

    return products;
  }

  @Query(() => PaginatedProducts)
  async disabledProducts(
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
  ) {
    const products = await this.productsService.findDisabled(
      {
        page,
        perPage,
      },
      true,
    );

    return products;
  }

  @Query(() => ProductModel)
  async product(@Args('id', { type: () => Int }) id: number) {
    const product = await this.productsService.findOne(id);

    return product;
  }

  @Mutation(() => ProductModel)
  async createProduct(
    @Args('categoryId', { type: () => Int }) categoryId: number,
    @Args('input') input: CreateProductModel,
  ) {
    const product = await this.productsService.create(input, categoryId);

    return product;
  }
  //Update not working, waiting for revision
  @Mutation(() => ProductModel)
  async updateProduct(@Args('input') input: UpdateProductModel) {
    const product = await this.productsService.update(input.id, input);

    return product;
  }
  //Update not working, waiting for revision
  @Mutation(() => ProductModel)
  async removeProduct(@Args('id', { type: () => Int }) id: number) {
    const deletedProduct = await this.productsService.remove(id);

    return deletedProduct;
  }
}
