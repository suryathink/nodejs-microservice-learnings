import { Hono } from "hono";
import sayHelloRoute from "./controllers/sayHello";

const app = new Hono();


// kind of controller
app.route('/sayHello', sayHelloRoute)


app.get("/:id",
  async (c) => {
  const id = c.req.param("id");
  return c.text(`Hello Hono! ${id}`);
});



app.post("/",async (c)=>{
  return c.json({
    message : 'Hello World, this is a POST request'
  })
})

export default app;
