import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BigIntInterceptor, ResponseInterceptor } from './common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new BigIntInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('My server')
    .setDescription('My server API 文档描述')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // 设置 Swagger UI 路径

  await app.listen(3000);
}
bootstrap();
