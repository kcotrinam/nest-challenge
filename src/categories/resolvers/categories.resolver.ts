import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryModel, PaginatedCategories } from '../models/category.model';
import { CategoriesService } from '../categories.service';
import { CreateCategoryModel } from '../models/create-category.model';
import { UpdateCategoryModel } from '../models/upcate-category.model';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/curret-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { CurrentUserGuard } from '../../auth/guards/curretn-user.guard';
import { PaginationGql } from '../../utils/args/pagination.args';
// import { PaginationGql } from '../../utils'

@Resolver(() => CategoryModel)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => PaginatedCategories)
  async categories(@Args() pagination: PaginationGql) {
    const categories = await this.categoriesService.findAll(
      {
        page: pagination.page,
        perPage: pagination.perPage,
      },
      false,
    );

    return categories;
  }

  @Query(() => CategoryModel)
  async category(@Args('id', { type: () => Int }) id: number) {
    const category = await this.categoriesService.findOne(id);
    return category;
  }

  @Mutation(() => CategoryModel)
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async createCategory(
    @CurrentUser() user,
    @Args('input') input: CreateCategoryModel,
  ) {
    const category = await this.categoriesService.create(input);

    return category;
  }

  @Mutation(() => CategoryModel)
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async updateCategory(
    @CurrentUser() user,
    @Args('input') input: UpdateCategoryModel,
  ) {
    const category = await this.categoriesService.update(input.id, user);
    return category;
  }

  @Mutation(() => CategoryModel)
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async removeCategory(
    @CurrentUser() user,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const deletedCategory = await this.categoriesService.remove(id);
    return deletedCategory;
  }
}
