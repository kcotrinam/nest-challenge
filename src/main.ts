import { PrismaService } from './prisma-service/prisma.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('NestJsChallengeApi')
    .setDescription(
      'This is a swagger documentation for Ravn Nest Nerdery program challenge',
    )
    .setVersion('1.0')
    .setBasePath('path')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
