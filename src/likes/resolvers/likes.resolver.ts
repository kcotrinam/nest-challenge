import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LikeModel } from '../models/like.model';
import { LikesService } from '../likes.service';
import { CreateLikeModel } from '../models/create-like.model';

@Resolver(() => LikeModel)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => LikeModel)
  async createLike(@Args('input') input: CreateLikeModel) {
    const like = await this.likesService.create(input.productId, input.userId);
    return like;
  }

  @Mutation(() => LikeModel)
  async removeLike(@Args('input') input: CreateLikeModel) {
    return await this.likesService.remove(input.productId, input.userId);
  }
}
