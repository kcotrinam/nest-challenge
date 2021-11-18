import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { paginatedHelper } from '../pagination/pagination.helper';
import { paginationSerializer } from '../pagination/serializer';
import { AttachmentService } from '../attachment/attachment.service';
import { plainToClass } from 'class-transformer';
import { ProductDto } from './dto/product.dto';
import { DetailedProductDto } from './dto/detailed-product.dto';
import { errorMessage } from '../utils/error-message-constructor';
import { getEdges } from 'src/utils/args/pagination.args';
import { ProductModel } from './models/products.model';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly attachmentService: AttachmentService,
  ) {}

  async create(
    input: CreateProductDto,
    categoryId: number,
    isManager: boolean,
  ) {
    if (!isManager) {
      throw new HttpException(
        errorMessage(
          HttpStatus.FORBIDDEN,
          'ONLY MANAGERS CAN CREATE A NEW PRODUCT',
        ),
        HttpStatus.FORBIDDEN,
      );
    }

    const newProduct = await this.prismaService.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        stock: input.stock,
        categoryId: categoryId,
        isDisabled: input.isDisabled,
      },
    });

    return plainToClass(DetailedProductDto, newProduct);
  }

  async findAll(paginationQuery: PaginationQueryDto, isRestLayer = true) {
    const { page, perPage } = paginationQuery;
    const { skip, take } = paginatedHelper(paginationQuery);
    const total = await this.prismaService.product.count({
      where: { isDisabled: false },
    });
    const pageInfo = paginationSerializer(total, { page, perPage });

    const products = await this.prismaService.product.findMany({
      where: { isDisabled: false },
      skip,
      take,
    });

    if (!isRestLayer) {
      const edges = getEdges(plainToClass(ProductModel, products));

      return { edges, pageInfo };
    }

    return { pageInfo, data: plainToClass(ProductDto, products) };
  }

  async findDisabled(
    paginationQuery: PaginationQueryDto,
    isManager: boolean,
    isRestLayer = true,
  ) {
    if (!isManager) {
      throw new HttpException(
        errorMessage(
          HttpStatus.FORBIDDEN,
          'ONLY MANAGERS CAN VIEW DISABLED PRODUCTS',
        ),
        HttpStatus.FORBIDDEN,
      );
    }

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

    if (!isRestLayer) {
      const edges = getEdges(plainToClass(ProductModel, products));

      return { edges, pageInfo };
    }

    return { pageInfo, data: plainToClass(DetailedProductDto, products) };
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'PRODUCT NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    return plainToClass(DetailedProductDto, product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    isManager: boolean,
  ) {
    if (!isManager) {
      throw new HttpException(
        errorMessage(HttpStatus.FORBIDDEN, 'ONLY MANAGERS CAN UPDATE PRODUCTS'),
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });

    return { data: plainToClass(UpdateProductDto, updatedProduct) };
  }

  async updateLikes(id: number, action: string): Promise<void> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (action === 'increase') {
      await this.prismaService.product.update({
        where: { id },
        data: { likeCounter: product.likeCounter + 1 },
      });
    } else {
      await this.prismaService.product.update({
        where: { id },
        data: { likeCounter: product.likeCounter - 1 },
      });
    }
  }

  async remove(id: number, isManager: boolean) {
    if (!isManager) {
      throw new HttpException(
        errorMessage(HttpStatus.FORBIDDEN, 'ONLY MANAGERS CAN DELETE PRODUCTS'),
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const deletedProduct = await this.prismaService.product.delete({
        where: { id },
      });
      return deletedProduct;
    } catch (error) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'PRODUCT NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async switchAvailability(id: number, isManager: boolean) {
    if (!isManager) {
      throw new HttpException(
        errorMessage(
          HttpStatus.FORBIDDEN,
          'ONLY MANAGERS CAN CHANGE PRODUCTS AVAILABILITY',
        ),
        HttpStatus.FORBIDDEN,
      );
    }

    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new HttpException(
        errorMessage(HttpStatus.NOT_FOUND, 'PRODUCT NOT FOUND'),
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: { isDisabled: !product.isDisabled },
    });

    return plainToClass(DetailedProductDto, updatedProduct);
  }

  async uploadImage(
    buffer: Buffer,
    fileName: string,
    userRole: boolean,
    productId: number,
  ) {
    if (!userRole) throw new HttpException('Unauthorized', 401);

    const uploadedImage: any = await this.attachmentService.uploadFile(
      buffer,
      fileName,
    );

    this.prismaService.attachment.create({
      data: {
        url: uploadedImage.Location,
        key: uploadedImage.Key,
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });
  }

  async deleteImage(id: number) {
    const attachment = await this.prismaService.attachment.findUnique({
      where: { id },
    });
    await this.attachmentService.deleteFile(+attachment.id);
    return this.prismaService.attachment.delete({ where: { id } });
  }

  async findImages(productId: number) {
    const images = await this.prismaService.attachment.findMany({
      where: { productId },
    });

    return Promise.all(
      images.map(async (image) => {
        const url = await this.attachmentService.generatePresignedUrl(
          image.key,
        );
        return {
          ...image,
          url,
        };
      }),
    );
  }
}
