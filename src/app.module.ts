import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthMiddleware,
  PublicLimiterMiddlewareWithWeight,
  PrivateLimiterMiddlewareWithWeight } from './middleware';
import { configService } from './config/config.service';
import { Store, StoreModule } from './limiter';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    StoreModule,
  ],
  controllers: [AppController],
  providers: [Store],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, PrivateLimiterMiddlewareWithWeight(1))
      .forRoutes({ path: '/private' , method: RequestMethod.GET});
    consumer
      .apply(PublicLimiterMiddlewareWithWeight(1))
      .forRoutes({ path: '/' , method: RequestMethod.GET});
  }
}
