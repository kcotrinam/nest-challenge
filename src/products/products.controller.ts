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

@Controller('categories')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly attachmentService: AttachmentService,
  ) {}

  @Post(':categoryId/products')
  async create(
    @Param('categoryId') categoryId: number,
    @Body() createProductDto: CreateProductDto,
    @Req() req,
  ) {
    const currentUser = req.currentUserRole;
    if (currentUser) {
      const product = await this.productsService.create(
        createProductDto,
        +categoryId,
      );

      return product;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'ONLY MANAGERS CAN CREATE A NEW PRODUCT',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
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

  @Get(':categoryId/disabledProducts')
  async findDisabled(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(2), ParseIntPipe) perPage: number,
    @Req() req,
  ) {
    const currentUser = req.currentUserRole;
    if (currentUser) {
      return this.productsService.findDisabled({
        page,
        perPage,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'ONLY MANAGERS CAN SEE THE LIST OF DISABLED PRODUCTS',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get(':categoryId/products/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':categoryId/products/:id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    const currentUser = req.currentUserRole;
    if (currentUser) {
      return this.productsService.update(+id, updateProductDto);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'ONLY MANAGERS CAN UPDATE A PRODUCT',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Delete(':categoryId/products/:id')
  remove(@Param('id') id: string, @Req() req) {
    const currentUser = req.currentUserRole;
    if (currentUser) {
      return this.productsService.remove(+id);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'ONLY MANAGERS CAN DELETE A PRODUCT',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('products/image')
  @UseInterceptors(FileInterceptor('file'))
  addImage(@Req() req, @UploadedFile() file, @Res() res) {
    this.attachmentService.uploadFile(file.buffer, file.originalname);

    res.status(200).send('ok');
  }
}
