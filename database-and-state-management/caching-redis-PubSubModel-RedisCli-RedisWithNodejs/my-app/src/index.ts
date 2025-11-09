import { Hono } from "hono";
import { Redis } from "ioredis";

const app = new Hono();

// ✅ connect to local Redis (default: 127.0.0.1:6379)
const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/result", async (c) => {
  // simulate a delay from db call
  // await new Promise ((resolve) => setTimeout(resolve,2000))
  let cachedTotal = await redis.get("total");
  if (cachedTotal) {
    return c.json({ result: cachedTotal });
  }

  let total = 0;
  for (let i = 0; i < 1000000000; i++) {
    total += i * 1;
  }
  // set cache
  redis.set("total", total, "EX", 60 * 60);

  return c.json({
    result: total,
  });
});

export default app;
