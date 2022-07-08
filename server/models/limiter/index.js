store = require('./dbForLimiter.js');
cache = require('./cacheForLimiter.js');

const limiterCreator = (
    { pgConectingString, tableName }, 
    redisConectionConfigure) => {
    store.createTable(pgConectingString, tableName);
    cache.createRedisCache(redisConectionConfigure);

    class storeField {
        constructor(uuid, count, firstReqTime) {
            this.uuid = uuid;
            this.count = count;
            this.first_req_for_window_time = firstReqTime;
        }
    }

    return class RequestLimiter {
        constructor(limit, timeToRefreshRequestCounter) {
            this.limit = limit;
            this.timeToRefresh = timeToRefreshRequestCounter;
        }

        async requestAllowed(uuid, weight) {
            const now = Date.now();
            let cached = true;
            let counter = await cache.get(uuid);
            //console.log(uuid + ': Go to cache: ' + (counter ? 'count=' + counter.count : 'no data' ));
            if(counter === null) {
                cached = false;
                counter = await store.getCounterByUUID(uuid);
                //console.log(uuid + ': Go to store ' + (counter ? 'count=' + counter.count : 'no data' ));
            }

            if(counter === null) {
                counter = new storeField(uuid, weight, now);
                await store.addNewCounter(counter);
                //console.log(uuid + ': Add counter to store: ' + (counter ? 'count=' + counter.count : 'no data' ));
            } else if(now - counter.first_req_for_window_time > this.timeToRefresh) {
                //console.log(uuid + ': Reset counter: ' + (counter ? 'count=' + counter.count : 'no data' ));
                counter = new storeField(uuid, weight, now);
                await store.resetCounterByUUID(uuid, counter);
                if(cached) {
                    //console.log('remove ' + uuid + ' from cache');
                    await cache.free(uuid);
                }
            } else if(counter.count < this.limit) {
                await store.addCountByUUID(uuid, weight);
                //console.log(uuid + ': Add ' + weight + ' to counter\'s');
                if(cached) {
                    console.log('remove ' + uuid + ' from cache');
                    await cache.free(uuid);
                }
            } else {
                if(!cached) {
                    //console.log('add ' + uuid + ' to cache');
                    await cache.set(uuid, counter);
                }
                const nextReqTime = this.timeToRefresh + +counter.first_req_for_window_time;
                return {
                    allowed: false,
                    message: 'Riched requests limit wich is ' + this.limit + '. Next try in ' + (new Date(nextReqTime)).toLocaleString('ru'),
                };
            }

            return {
                allowed: true,
                message: 'OK',
            };
        }
    }
};

module.exports = limiterCreator;