import { Injectable, NestMiddleware, Type } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestLimiter, Store } from '../limiter';
import { configService } from '../config/config.service';

const RATE_LIMIT_BY_IP = +configService.getPublicLimit() || 100;
const RESET_TIME_BY_IP = +configService.getPublicResetTime() || 60 * 60 * 1000;

export const PublicLimiterMiddlewareWithWeight = ( weight: number ): Type<NestMiddleware> =>  {
  @Injectable() 
  class LimiterMiddleware implements NestMiddleware {
    private limiter: RequestLimiter;

    constructor(private store: Store) {
      this.limiter = new RequestLimiter(this.store, RATE_LIMIT_BY_IP, RESET_TIME_BY_IP);
    }

    use(req: Request, res: Response, next: NextFunction) {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      this.limiter.requestAllowed(ip.toString(), weight)
      .then( () => {
        next();
      })
      .catch( (err) => next(err));
    }
  }
  return LimiterMiddleware;
}