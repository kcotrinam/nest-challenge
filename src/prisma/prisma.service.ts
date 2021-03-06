import {
  INestApplication,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      rejectOnNotFound: (error: Error) => new NotFoundException(error.message),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async clearDatabase() {
    await this.like.deleteMany({});
    await this.product.deleteMany({});
    await this.token.deleteMany({});
    await this.user.deleteMany({});
    await this.order.deleteMany({});
    await this.orderProduct.deleteMany({});
    await this.category.deleteMany({});
  }
}
