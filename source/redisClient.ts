import * as redis from "redis";

const redisClient = redis.createClient();

redisClient.on("error", error => {
  console.error(error);
  process.exit(1);
});

export default redisClient;
