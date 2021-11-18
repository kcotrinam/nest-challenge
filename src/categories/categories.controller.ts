import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(20), ParseIntPipe) perPage: number,
  ) {
    return await this.categoriesService.findAll({
      page,
      perPage,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req,
    @Res() res,
  ) {
    const newCategory = await this.categoriesService.create(createCategoryDto);

    res.status(200).json(newCategory);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req,
    @Res() res,
  ) {
    const updatedCategory = await this.categoriesService.update(
      +id,
      req.currentUserRole,
      updateCategoryDto,
    );

    res.status(200).json(updatedCategory);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req): void {
    this.categoriesService.remove(+id, req.currentUserRole);
  }
}
