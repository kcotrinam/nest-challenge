import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CategoryModel } from '../models/categories.model';
import { CategoriesService } from '../categories.service';

@Resolver((of) => CategoryModel)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query((returns) => [CategoryModel])
  async categories(
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
  ) {
    const categories = await this.categoriesService.findAll(true, {
      page,
      perPage,
    });

    return categories.data;
  }

  @ResolveField()
  async category(@Parent() categories: CategoryModel[]) {
    const category = await this.categoriesService.findOne(1, true);
    return category;
  }
}