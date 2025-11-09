command to start redis and get its GUI

docker run -d --name redis-stack -p 6739:6739 -p 8001:8001 redis/redis-stack:latest
