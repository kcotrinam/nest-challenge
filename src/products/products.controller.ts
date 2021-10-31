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
  UploadedFile,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentService } from 'src/attachment/attachment.service';

@Controller()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly attachmentService: AttachmentService,
  ) {}

  @Post('categories/:categoryId/products')
  async create(
    @Param('categoryId') categoryId: number,
    @Body() createProductDto: CreateProductDto,
    @Req() req,
    @Res() res,
  ) {
    const product = await this.productsService.create(
      createProductDto,
      +categoryId,
      req.currentUserRole,
    );

    res.status(201).json(product);
  }

  @Get('products')
  async findAll(
    @Res() res,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    const products = await this.productsService.findAll({
      page,
      perPage,
    });

    res.status(200).json(products);
  }

  @Get('categories/:categoryId/disabledProducts')
  async findDisabled(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(2), ParseIntPipe) perPage: number,
    @Req() req,
  ) {
    return this.productsService.findDisabled(
      {
        page,
        perPage,
      },
      req.currentUserRole,
    );
  }

  @Get('products/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch('products/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
    @Res() res,
  ) {
    const product = await this.productsService.update(
      +id,
      updateProductDto,
      req.currentUserRole,
    );

    res.status(200).json(product);
  }

  @Patch('products/:id/switch-availabilty')
  async switchAvailability(@Req() req, @Param('id') id: string, @Res() res) {
    const product = await this.productsService.switchAvailability(
      +id,
      req.currentUserRole,
    );

    res.status(200).json(product);
  }

  @Delete('products/:id')
  async remove(@Param('id') id: string, @Req() req, @Res() res): Promise<void> {
    await this.productsService.remove(+id, req.currentUserRole);

    res.status(200).send('OK');
  }

  @Post('categories/:categoryId/products/:id/image')
  @UseInterceptors(FileInterceptor('file'))
  addImage(
    @Param('id') id: string,
    @UploadedFile() file,
    @Req() req,
    @Res() res,
  ) {
    this.productsService.uploadImage(
      file.buffer,
      file.originalname,
      req.currentUserRole,
      +id,
    );

    res.status(200).send('ok');
  }

  @Get('categories/:categoryId/products/:id/images')
  async getImages(@Param('id') id: string) {
    return this.productsService.findImages(+id);
  }
}
