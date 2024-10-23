import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@/common';
import { ProductModule } from './product/product.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), ProductModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
