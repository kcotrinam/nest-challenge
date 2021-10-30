import { HttpException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { PrismaService } from 'src/prisma-service/prisma.service';
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
}
