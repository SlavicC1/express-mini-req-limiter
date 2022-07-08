const express = require('express');
const router = express.Router();
const RequestLimiter = require('../models/limiter')(
    {
        pgConectingString: "postgres://postgres:pg-pass@localhost:5432/postgres",
        tableName: "limiter_counter_table"
    },
    {
        port: 6379,
        host: "127.0.0.1",
        db: 0, 
    });

const RATE_LIMIT_BY_IP = process.env.RATE_LIMIT_BY_IP || 100;
const RATE_LIMIT_BY_TOKEN = process.env.RATE_LIMIT_BY_TOKEN || 200;

const HOUR = 60 * 60 * 1000;

const publicRequestLimiter = new RequestLimiter(RATE_LIMIT_BY_IP, HOUR);
const privateRequestLimiter = new RequestLimiter(RATE_LIMIT_BY_TOKEN, HOUR);

function createRouterWithToken(token){

    let publicLimiter = (req, res, next) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const allowed = publicRequestLimiter.requestAllowed(ip, 1);
        allowed.then( (result) => {
            if(result.allowed) {
            next();
            } else {
                const err = new Error(result.message);
                err.status = 429;
                next(err); 
            }
        }).catch( (err) => {
            next(err); 
        });
    };

    let privateLimiter = (req, res, next) => {
        const token = req.headers.authorization;
        const allowed = privateRequestLimiter.requestAllowed(token, 1);
        allowed.then( (result) => {
            if(result.allowed) {
            next();
            } else {
                const err = new Error(result.message);
                err.status = 429;
                next(err); 
            }
        }).catch( (err) => {
            next(err); 
        });
    };

    let auth = (req, res, next) => {
        if(req.headers.authorization != token) {
            const err = new Error('Access denied');
            err.status = 401;
            next(err); 
        } else {
            next();
        }
    }

    router.get('/', publicLimiter, (req, res)=>{
        res.json({
            message: 'Public page'
        })
    });

    router.get('/private', auth, privateLimiter, (req, res)=>{
        res.json({
            message: 'Private page'
        })
    });

    return router;
}

module.exports = createRouterWithToken;