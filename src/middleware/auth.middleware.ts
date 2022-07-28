import { Injectable, NestMiddleware, HttpStatus, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const TOKEN = process.env.TOKEN || 'token-1';

@Injectable() 
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if(req.headers.authorization != TOKEN) {
            throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);
        }
        next();
    }
}