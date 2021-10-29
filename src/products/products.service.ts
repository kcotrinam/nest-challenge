import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = createProductDto;
    return await this.prismaService.product.create({ data: product });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    let { limit, offset } = paginationQuery;
    if (!offset) {
      offset = 1;
    }
    if (!limit) {
      limit = 1;
    }
    return await this.prismaService.product.findMany({
      where: { isDisabled: false },
      take: +limit,
      skip: +offset,
    });
  }

  async findOne(id: number) {
    return await this.prismaService.product.findUnique({ where: { id } });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.product.delete({ where: { id } });
  }
}
