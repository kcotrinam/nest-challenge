import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { PaginationQueryDto } from 'src/pagination/dtos/pagination-query.dto';
import { paginatedHelper } from 'src/pagination/pagination.helper';
import { paginationSerializer } from 'src/pagination/serializer';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto, categoryId: number) {
    const product = createProductDto;
    return await this.prismaService.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: categoryId,
      },
    });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page, perPage } = paginationQuery;
    const { skip, take } = paginatedHelper(paginationQuery);
    const total = await this.prismaService.product.count();
    const pageInfo = paginationSerializer(total, { page, perPage });
    const products = await this.prismaService.product.findMany({
      skip,
      take,
    });
    return { pageInfo, data: products };
  }

  async findDisabled(paginationQuery: PaginationQueryDto) {
    const { page, perPage } = paginationQuery;
    const { skip, take } = paginatedHelper(paginationQuery);
    const total = await this.prismaService.product.count({
      where: { isDisabled: true },
    });
    const pageInfo = paginationSerializer(total, { page, perPage });
    const products = await this.prismaService.product.findMany({
      where: { isDisabled: true },
      skip,
      take,
    });
    return { pageInfo, data: products };
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
