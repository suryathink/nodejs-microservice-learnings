import { Hono } from "hono";
import { dbConnect } from "../config/db";

const app = new Hono().get('/')



export default app;