import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('categories')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':categoryId/products')
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get(':categoryId/products')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(2), ParseIntPipe) perPage: number,
  ) {
    return this.productsService.findAll({
      page,
      perPage,
    });
  }

  @Get(':categoryId/products')
  async findByCategory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(2), ParseIntPipe) perPage: number,
    @Param('categoryId') categoryId: string,
  ) {
    return this.productsService.findAll({
      page,
      perPage,
    });
  }

  @Get(':categoryId/products/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':categoryId/products/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':categoryId/products/:id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
