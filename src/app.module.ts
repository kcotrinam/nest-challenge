import { PrismaService } from './prisma/prisma.service';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { join } from 'path';
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
import { OrderProductsModule } from './order-products/order-products.module';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    ProductsModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
    LikesModule,
    TokensModule,
    OrdersModule,
    OrderProductsModule,
    PrismaModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
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
    // consumer
    //   .apply(LoggerMiddleware)
    //   .exclude(
    //     { path: 'auth', method: RequestMethod.POST },
    //     { path: 'categories/:categoryId/products', method: RequestMethod.GET },
    //     {
    //       path: 'products/:id',
    //       method: RequestMethod.GET,
    //     },
    //     {
    //       path: 'products',
    //       method: RequestMethod.GET,
    //     },
    //     {
    //       path: 'graphql',
    //       method: RequestMethod.GET,
    //     },
    //     { path: 'orders', method: RequestMethod.GET },
    //     {
    //       path: 'accounts/me/categories/:categoryId/products',
    //       method: RequestMethod.GET,
    //     },
    //     { path: 'users', method: RequestMethod.GET },
    //     'accounts/me/orders/(.*)',
    //     'auth/(.*)',
    //   )
    //   .forRoutes('*');
  }
}
