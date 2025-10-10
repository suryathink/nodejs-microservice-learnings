// instead of controller, we create controllers like this
import { Hono } from "hono";
import {zValidator} from '@hono/zod-validator' 
import {z} from 'zod'
const app = new Hono();


app.get('/:id',
    zValidator('param', z.object({
     id: z.string().min(5, 'Id is required and it must be of length 5')
    })),
     async(c) => {
    const id = c.req.param('id');
    return c.json({
        message:`Hello ${id}`
    },200)
})


export default app;