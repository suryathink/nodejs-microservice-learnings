import { Hono } from "hono";
import { connectDB } from "./config/db";
import postModel from "./model/post.model";

const app = new Hono();
/**
 *  we have 3 dbs,which db url we have to connect??
 *  so for write requests we have to use master database
 *  and for read requests we have to use slave db,
 *  so how to configure that
 *  so abhi hume I have to provide an address for these 3 dbs , and rest will be
 *  handles by mongodb drivers
 *
 *  there is a catch, be defaults our read requests will also go to
 *  master database, we have to manually configure our read requests to slave dbs
 *  and write request to master db
 *  (readPreference=secondary)
 */
const uri =
  "mongodb://mongo1:27017,mongo2:27017,mongo3:27017/mydb?replicaSet=rs0&readPreference=secondary";
const establishDbConnection = async () => {
  try {
    await connectDB(uri);
  } catch (error:any) {
    console.error("error in establishDbConnection" , error.message)
  }
};
establishDbConnection()


app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/post/create", async (c) => {
  const { text } = await c.req.json();

  if (!text) {
    return c.json({ error: "Text is required" }, 400);
  }

  const post = new postModel({ text });
  try {
    await post.save();
    return c.json({ message: "Post created successfully", post }, 201);
  } catch (error) {
    console.error("Error creating post:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

app.get("/posts", async (c) => {
  try {
    const posts = await postModel.find();
    return c.json(posts, 200);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

export default app;
