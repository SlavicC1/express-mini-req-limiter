import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestLimiter, Store } from '../limiter';
import { configService } from '../config/config.service';

//TO DO 
//Описать тип для Limiter 
//фабрика @Injectable() классов
type Limiter = any;

const RATE_LIMIT_BY_TOKEN = +configService.getPrivateLimit() || 200;
const RESET_TIME_BY_TOKEN = +configService.getPrivateResetTime() || 60 * 60 * 1000;

export const PrivateLimiterMiddlewareWithWeight = ( weight: number ): Limiter =>  {  
  @Injectable() 
  class LimiterMiddleware implements NestMiddleware {
    private limiter: RequestLimiter;

    constructor(private store: Store) {
      this.limiter = new RequestLimiter(this.store, RATE_LIMIT_BY_TOKEN, RESET_TIME_BY_TOKEN);
    }

    use(req: Request, res: Response, next: NextFunction) {
      const token = req.headers.authorization;
      this.limiter.requestAllowed(token, weight)
      .then( () => {
        next();
      })
      .catch( (err) => next(err));
    }
  }
  return LimiterMiddleware;
}