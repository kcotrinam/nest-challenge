import { PrismaService } from './prisma-service/prisma.service';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module';
import { TokensModule } from './tokens/tokens.module';
import { OrdersModule } from './orders/orders.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TokensService } from './tokens/tokens.service';
import { UsersService } from './users/users.service';
import { AttachmentService } from './attachment/attachment.service';

@Module({
  imports: [
    ProductsModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
    LikesModule,
    TokensModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    TokensService,
    UsersService,
    AttachmentService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'auth', method: RequestMethod.POST },
        { path: 'categories/:categoryId/products', method: RequestMethod.GET },
        {
          path: 'categories/:categoryId/products/:id',
          method: RequestMethod.GET,
        },
        { path: 'orders', method: RequestMethod.GET },
        {
          path: 'accounts/me/categories/:categoryId/products',
          method: RequestMethod.GET,
        },
        { path: 'accounts/me/orders', method: RequestMethod.GET },
        { path: 'categories', method: RequestMethod.GET },
        { path: 'users', method: RequestMethod.GET },
        'accounts/me/orders/(.*)',
        'auth/(.*)',
      )
      .forRoutes('*');
  }
}
