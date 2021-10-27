import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('products/:productId')
export class LikesController {
  constructor(private readonly likes: LikesService) {}

  @Post('/likes')
  async create(@Body() createLikeDto: CreateLikeDto) {
    return await this.likes.create(createLikeDto);
  }

  @Delete('likes/:id')
  async remove(@Param('id') id: string) {
    return await this.likes.remove(+id);
  }
}
