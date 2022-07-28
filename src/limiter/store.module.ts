
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestCounter } from './requestCounter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestCounter])],
  exports: [TypeOrmModule]
})
export class StoreModule {}
