const Redis = require('ioredis');

let client = null;

module.exports = {
    createRedisCache: (redisConectionConfigure) => {
        client = new Redis(redisConectionConfigure);
        client.keys('*').then( (keys) => {
            var pipeline = client.pipeline();
            keys.forEach( (key) => {
              pipeline.del(key);
            });
            return pipeline.exec();
        });
        client.on('ready', () => {
            console.log('limiter\'s redis conected on: ' + (redisConectionConfigure.host || "127.0.0.1") + ':' + (redisConectionConfigure.port || 6379) + 
            ', it uses db=' + (redisConectionConfigure.db || 0));
        });
        
        process.on('end', () => {
            client.quit();
        });
        
        client.on('error', (err) => {
          console.log('Error ' + err);
        });
    },

    set: async (key, value) => {
        await client.set(key, await JSON.stringify(value));
    },

    get: async (key) => {
        const value = await JSON.parse( await client.get(key));
        return value;
    },

    free: async (key) => {
        await client.del(key);
    }
};
