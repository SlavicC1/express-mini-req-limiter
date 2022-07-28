
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestCounter } from './requestCounter.entity';

@Injectable()
export class Store {
  constructor(
    @InjectRepository(RequestCounter)
    private requestRepository: Repository<RequestCounter>,
  ) {}

  findAll(): Promise<RequestCounter[]> {
    return this.requestRepository.find();
  }

  findOne(uuid: string): Promise<RequestCounter> {
    return this.requestRepository.findOneBy({ uuid });
  }

  async remove(uuid: string): Promise<void> {
    await this.requestRepository.delete(uuid);
  }

  async save(counter: RequestCounter): Promise<void>{
    await this.requestRepository.save(counter);
  }
}
