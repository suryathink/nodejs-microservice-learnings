import { Hono } from 'hono';
import { dbConnect } from './config/db';
const app = new Hono()

dbConnect()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
