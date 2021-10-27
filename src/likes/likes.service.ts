import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { PrismaService } from 'src/prisma-service/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto) {
    const like = createLikeDto;
    return await this.prisma.like.create({ data: like });
  }

  async remove(id: number) {
    return await this.prisma.like.delete({ where: { id } });
  }
}
