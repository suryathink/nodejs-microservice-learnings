import { serve } from "bun";
import { Hono } from "hono";
import { connectToRabbitMQ } from "./config/rabitmq.config";

const app = new Hono();

connectToRabbitMQ()
  .then(({ channel }) => {
    channel.consume("paymentQueue", async (msg) => {
      if (msg) {
        const paymentDetails = JSON.parse(msg.content.toString());
        console.log(`Processing Payment for booking ID: ${paymentDetails.id}`);

        // simulate payment processing
        const paymentSuccess = true;
        if (paymentSuccess) {
          console.log(
            `Payment successful for booking ID: ${paymentDetails.id}`
          );

          // push it to notification queue
          await channel.sendToQueue(
            "notificationQueue",
            Buffer.from(JSON.stringify(paymentDetails)),
            {
              persistent: true,
            }
          );
        } else {
          console.log(`Processing failed for booking ID: ${paymentDetails.id}`);
          // push to compensation queue
          await channel.sendToQueue(
            "booking.compensationQueue",
            Buffer.from(JSON.stringify(paymentDetails)),
            {
              persistent: true,
            }
          );
        }
      }
    });

    channel.consume("payments.compensationQueue", async (msg) => {
      if (msg) {
        const paymentDetails = JSON.parse(msg.content.toString());
        console.log(
          `Received compensation for payment of booking ID: ${paymentDetails.id}`
        );

        // handle compensation logic here, e.g., refund process

        channel.sendToQueue(
          "booking.compensationQueue",
          Buffer.from(JSON.stringify(paymentDetails)),
          {
            persistent: true,
          }
        );
        channel.ack(msg);
      }
    });

    const server = serve({
      fetch: app.fetch,
      port: 3001,
    });

    console.log(
      `Payment service server running on http://localhost:${server.port}`
    );
  })
  .catch((error) => {
    console.error("Error connecting to RabbitMQ:", error);
  });
