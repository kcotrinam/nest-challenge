import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryModel } from '../models/categories.model';
import { CategoriesService } from '../categories.service';
import { CreateCategoryModel } from '../models/create-category.model';
import { UpdateCategoryModel } from '../models/upcate-category.model';

@Resolver(() => CategoryModel)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [CategoryModel])
  async categories(
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
  ) {
    const categories = await this.categoriesService.findAll({
      page,
      perPage,
    });

    return categories.data;
  }

  @Query(() => CategoryModel)
  async category(@Args('id', { type: () => Int }) id: number) {
    const category = await this.categoriesService.findOne(id);
    return category;
  }

  @Mutation(() => CategoryModel)
  async createCategory(@Args('input') input: CreateCategoryModel) {
    const category = await this.categoriesService.create(input, true);
    return category;
  }

  @Mutation(() => CategoryModel)
  async updateCategory(@Args('input') input: UpdateCategoryModel) {
    const category = await this.categoriesService.update(input.id, true, input);
    return category;
  }

  @Mutation(() => CategoryModel)
  async removeCategory(@Args('id', { type: () => Int }) id: number) {
    const deletedCategory = await this.categoriesService.findOne(id);
    await this.categoriesService.remove(id, true);
    return deletedCategory;
  }
}
