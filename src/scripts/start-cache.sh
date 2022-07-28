#!/bin/bash
set -e

SERVER="redis";
PW="redispw";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -e REDIS_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 6379:6379 \
  -d redis

# wait for redis to start
echo "sleep wait for redis-server [$SERVER] to start";
SLEEP 1;

echo "redis container is ready"