import { Hono } from "hono";
import { hc } from "hono/client";
import { AppType } from "../../4.rpc-with-hono/src/index";
const app = new Hono();

const client = hc<AppType>('http://localhost:3000')

app.get("/", async (c) => {
  // rpc call to another service
  const response = await client.test.$post({
    json :{
      name:"sandy"
    }
  })
  const data = await response.json()
  return c.json(data)
});


// way to change port and export the app
export default {
  fetch: app.fetch,
  port: 3001,
};
