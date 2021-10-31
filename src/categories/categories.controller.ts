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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req) {
    const currentUser = req.currentUserRole;
    if (currentUser) {
      return this.categoriesService.create(createCategoryDto);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'ONLY MANAGERS CAN CREATE A NEW CATEGORY',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req,
  ) {
    const currentUser = req.currentUserRole;
    if (currentUser) {
      return this.categoriesService.update(+id, updateCategoryDto);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'ONLY MANAGERS CAN UPDATE A CATEGORY',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const currentUser = req.currentUserRole;
    if (currentUser) {
      return this.categoriesService.remove(+id);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'ONLY MANAGERS CAN DELETE A CATEGORY',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
