import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('products/:productsId')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('likes')
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @Delete('likes/:id')
  remove(@Param('id') id: string) {
    return this.likesService.remove(+id);
  }
}
