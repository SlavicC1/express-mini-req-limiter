import { HttpStatus, HttpException } from '@nestjs/common';
import { Store } from './store.service';
import { RequestCounter } from './requestCounter.entity';

export * from './store.service';
export * from './store.module';

export class RequestLimiter {
    private limit: number;
    private timeToRefresh: number;
    private store: Store;

    constructor(store: Store, reqLimitimit : number, timeToRefreshRequestCounter: number) {
        this.store = store;
        this.limit = reqLimitimit;
        this.timeToRefresh = timeToRefreshRequestCounter;
    }

    async requestAllowed(uuid: string, weight: number) {
        const now = Date.now();
        const counter = await this.store.findOne( uuid );
        console.log(counter);
        if(counter) {
            if (counter.count >= this.limit) {
                const dTime = now - counter.reqWindowStartTime;
                if(dTime >= this.timeToRefresh) {
                    const newCounter = new RequestCounter(uuid, weight, now);
                    await this.store.save(newCounter);
                } else {
                    const nextReqTime = +counter.reqWindowStartTime + this.timeToRefresh;
                    throw new HttpException('Riched requests limit wich is ' + this.limit 
                        + '. Next try in ' + (new Date(nextReqTime)).toLocaleString('ru'), HttpStatus.TOO_MANY_REQUESTS);
                }
            } else {
                await this.store.incrementCount(uuid, weight);
            }
        } else {
            const newCounter = new RequestCounter(uuid, weight, now);
            await this.store.save(newCounter);
        }
    }
}