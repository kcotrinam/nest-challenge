import { Controller, Post, Param, Delete, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Likes')
@Controller()
export class LikesController {
  constructor(private readonly likes: LikesService) {}

  @Post('products/:id/like')
  async create(@Req() req, @Param('id') id: string) {
    await this.likes.create(+id, req.currentUser);
  }

  @Delete('products/:id/unlike')
  async remove(@Param('id') id: string, @Req() req) {
    return await this.likes.remove(+id, req.currentUser);
  }
}
