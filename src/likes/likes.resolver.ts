import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LikeModel } from '../likes/models/likes.model';
import { LikesService } from './likes.service';
import { CreateLikeModel } from './models/create-like.model';

@Resolver(() => LikeModel)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => LikeModel)
  async createLike(@Args('input') input: CreateLikeModel) {
    const like = await this.likesService.create(input.productId, input.userId);
    console.log(like);
  }
}
