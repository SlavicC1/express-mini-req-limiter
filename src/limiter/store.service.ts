
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { RequestCounter } from './requestCounter.entity';

@Injectable()
export class Store {
  constructor(
    @InjectRepository(RequestCounter)
    private requestRepository: Repository<RequestCounter>,
    private dataSource: DataSource
  ) {}

  findOne(uuid: string, time: number): Promise<RequestCounter> {
    return  this.requestRepository.findOne({
      where: { uuid },
      cache: {
        id: uuid,
        milliseconds: time
      },
    });
  }

  private async removeFromCache(uuid: string) {
    await this.dataSource.queryResultCache!.remove([uuid]);
  }

  async save(counter: RequestCounter): Promise<void>{
    await this.removeFromCache(counter.uuid);
    await this.requestRepository.save(counter);
  }

  async incrementCount(uuid: string, weight: number) {
    await this.removeFromCache(uuid);
    await this.requestRepository.increment({ uuid }, 'count', weight);
  }
}
