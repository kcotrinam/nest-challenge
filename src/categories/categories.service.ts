import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { errorMessage } from '../utils/error-message-constructor';
import { plainToClass } from 'class-transformer';
import { CategoryDto } from './dto/category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { paginatedHelper } from '../pagination/pagination.helper';
import { paginationSerializer } from '../pagination/serializer';
import { getEdges } from 'src/utils/args/pagination.args';
import { CategoryModel } from './models/category.model';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(paginationQuery: PaginationQueryDto, isRestLayer = true) {
    const { page, perPage } = paginationQuery;
    const { skip, take } = paginatedHelper(paginationQuery);
    const total = await this.prismaService.category.count();
    const pageInfo = paginationSerializer(total, { page, perPage });
    const categories = await this.prismaService.category.findMany({
      skip,
      take,
    });

    if (!isRestLayer) {
      const edges = getEdges(plainToClass(CategoryModel, categories));

      return { edges, pageInfo };
    }
    return { pageInfo, data: plainToClass(CategoryDto, categories) };
  }

  async findOne(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    return plainToClass(CategoryDto, category);
  }

  async create(input: CreateCategoryDto, manager: boolean) {
    if (!manager) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'ONLY MANAGERS CAN CREATE A NEW CATEGORY',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const newCategory = await this.prismaService.category.create({
      data: input,
    });

    return plainToClass(CategoryDto, newCategory);
  }

  async update(
    id: number,
    manager: boolean,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    if (!manager) {
      throw new HttpException(
        errorMessage(HttpStatus.UNAUTHORIZED, 'YOU ARE NOT AUTHORIZED'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const updatedCategory = await this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return plainToClass(CategoryDto, updatedCategory);
  }

  async remove(id: number, manager: boolean) {
    if (!manager) {
      throw new HttpException(
        errorMessage(HttpStatus.UNAUTHORIZED, 'YOU ARE NOT AUTHORIZED'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const deletedCategory = await this.prismaService.category.delete({
      where: { id },
    });
    return deletedCategory;
  }
}
