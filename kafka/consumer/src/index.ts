import { Hono } from "hono";
import { kafka } from "./config/kafka.config";

const app = new Hono();

const consumer = kafka.consumer({ groupId: "test-group" });

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const init = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value?.toString(),
        });
      },
    });
  } catch (error) {
    console.error("Error initiating ", error);
  }
};

init()

export default {
  fetch: app.fetch,
  port: 3001
}
