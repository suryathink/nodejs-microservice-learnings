import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const route = app.post(
  "/test",
  zValidator(
    "json",
    z.object({
      name: z.string(),
    })
  ),

  async (c) => {
    const {name} = c.req.valid("json");
    return c.json({
      message: `Hello ${name}`,
    });
  }
);

export type AppType = typeof route
export default app;
