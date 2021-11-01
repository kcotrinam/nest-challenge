import { HttpException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AttachmentService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(dataBuffer: Buffer, fileName: string) {
    const s3 = new S3();
    const uploadResult: any = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: dataBuffer,
        Key: `${uuid()}-${fileName}`,
      })
      .promise();

    return { location: uploadResult.location, key: uploadResult.key };
  }

  async deleteFile(imageId: number) {
    const image = await this.prisma.attachment.findUnique({
      where: { id: imageId },
    });
    const s3 = new S3();

    await s3
      .deleteObject({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Key: image.key,
      })
      .promise();

    await this.prisma.attachment.delete({
      where: { id: imageId },
    });
  }

  async generatePresignedUrl(key: string) {
    console.log(key);
    const s3 = new S3();

    try {
      const url = await s3.getSignedUrlPromise('getObject', {
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Key: key,
      });

      return url;
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }
}
