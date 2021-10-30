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
  UseInterceptors,
  Req,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentService } from 'src/attachment/attachment.service';

@Controller('categories/:categoryId')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly attachmentService: AttachmentService,
  ) {}

  @Post('products')
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get('products')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(2), ParseIntPipe) perPage: number,
  ) {
    return this.productsService.findAll({
      page,
      perPage,
    });
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

  @Post('products/image')
  @UseInterceptors(FileInterceptor('file'))
  addImage(@Req() req, @UploadedFile() file, @Res() res) {
    this.attachmentService.uploadFile(file.buffer, file.originalname);

    res.status(200).send('ok');
  }
}
