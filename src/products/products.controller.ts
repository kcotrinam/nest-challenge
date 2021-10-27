import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

@Controller('categories/categoryId')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('products')
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get('products')
  async products(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get('products/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch('products/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete('products/:id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
