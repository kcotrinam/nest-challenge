import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../auth/decorators/curret-user.decorator';
import { CurrentUserGuard } from '../../auth/guards/curretn-user.guard';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { RolesGuard } from '../../auth/guards/role.guard';
import { UserModel } from '../models/users.model';
import { UsersService } from '../users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserModel])
  @UseGuards(GqlAuthGuard, RolesGuard, CurrentUserGuard)
  async users(
    @CurrentUser() user,
    @Args('page', { type: () => Int })
    page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
  ) {
    const categories = await this.usersService.findAll({
      page,
      perPage,
    });

    return categories.data;
  }

  @Query(() => [UserModel])
  async user(@Args('id', { type: () => Int }) id: number) {
    const user = await this.usersService.findOne(id);

    return user;
  }
}
