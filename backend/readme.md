# docker run -p 6379:6379 -e REDIS_PASSWORD=$redis_password -dt redis

$redis_password same as the variable in .env

.env includes the following variables>>

- REDIS_HOST=127.0.0.1
- REDIS_PORT=6379
- REDIS_PASSWORD=
- PORT=3001 (_server port_)
