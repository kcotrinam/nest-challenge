import { Controller, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('products')
export class LikesController {
  constructor(private readonly likes: LikesService) {}

  @Post('/:productId/likes')
  async create(@Param('productId') productId: number, @Req() req) {
    return await this.likes.create(+productId, +req.currentUser);
  }

  @Delete('/:productId/likes/:id')
  async remove(@Param('id') id: string, @Req() req) {
    return await this.likes.remove(+id, +req.currentUser);
  }
}
