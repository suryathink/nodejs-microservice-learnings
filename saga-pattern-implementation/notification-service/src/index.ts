import { serve } from "bun";
import { Hono } from "hono";
import { connectToRabbitMQ } from "./config/rabitmq.config";

const app = new Hono();

connectToRabbitMQ()
  .then(({ channel }) => {
    channel.consume("notificationQueue", async (msg) => {
      if (msg) {
        try {
          const notificationDetails = JSON.parse(msg.content.toString());
          console.log(`notification for booking ID: ${notificationDetails.id}`);

          // simulate notification sending logic here,  e.g. email or sms

          // push to queue
          channel.sendToQueue(
            "book.successQueue",
            Buffer.from(JSON.stringify(notificationDetails)),
            {
              persistent: true,
            }
          );
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing notification:", error);
          channel.sendToQueue("payments.compensationQueue", msg.content, {
            persistent: true,
          });
        }
      }
    });

    const server = serve({
      fetch: app.fetch,
      port: 3002,
    });

    console.log(
      `Notification service server running on http://localhost:${server.port}`
    );
  })
  .catch((error) => {
    console.error("Error connecting to RabbitMQ:", error);
  });
