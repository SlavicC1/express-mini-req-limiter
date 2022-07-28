import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'limiter_store' })
export class RequestCounter {
  @PrimaryColumn({type: 'text'})
  uuid: string;
  @Column()
  count: number;
  @Column({type: 'bigint'})
  reqWindowStartTime: number;

  constructor(uuid: string, weight: number, reqWindowStartTime: number) {
    this.uuid = uuid;
    this.count = weight;
    this.reqWindowStartTime = reqWindowStartTime;
  }
}
