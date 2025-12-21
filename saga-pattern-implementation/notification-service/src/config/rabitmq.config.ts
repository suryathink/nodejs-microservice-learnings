import { connect } from "amqplib";

export const connectToRabbitMQ = async () => {
  try {
    // amqp.connect("amqp://127.0.0.1:5672")

    const connection = await connect("amqp://127.0.0.1:5672")
;
    console.log("Connected to RabbitMQ");
    const channel = await connection.createChannel();

    return {connection, channel};
  } catch (error) {
    console.error("Connected to RabbitMQ", error);
    throw error;
  }
};
