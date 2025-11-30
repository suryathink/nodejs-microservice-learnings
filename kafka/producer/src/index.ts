import { Hono } from "hono";
import { kafka } from "./config/kafka.config";

const app = new Hono();

const producer = kafka.producer();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/create-topic", async (c) => {
  try {
    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
      topics: [{ topic: "test-topic" }],
    });

    await admin.disconnect();
    return c.text("Topic created successfully");
  } catch (error) {
    console.error("Error creating topic:", error);
    return c.text("Failed to create topic", 500);
  }
});
// inside topic there are partitions
app.get("/create-partitions", async (c) => {
  try {
    const admin = kafka.admin();
    await admin.connect();
    const topicMetaData = await admin.fetchTopicMetadata({
      topics: ["test-topic"],
    });
    const existingPartions = topicMetaData.topics[0].partitions.length;
    console.log({ existingPartions });

    if (existingPartions >= 5) {
      await admin.disconnect();
      return c.text(`Topic already has ${existingPartions} or more partitions`);
    }
    await admin.createPartitions({
      topicPartitions: [
        {
          topic: "test-topic",
          count: 5,
        },
      ],
    });

    await admin.disconnect();
    return c.text("Topic created successfully");
  } catch (error) {
    console.error("Error creating partitions:", error);
    return c.text("Failed to create partitions", 500);
  }
});

app.get("/produce-message", async (c) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "test-topic",
      messages: [
        { value: "Hello KafkaJS user! from 0th partion", partition: 0 },
        { value: "Hello KafkaJS user from 1st partition!", partition: 1 },
        { value: "Hello KafkaJS user from 2st partition !", partition: 2 },
        { value: "Hello KafkaJS user from 3rd partition !", partition: 3 },
        { value: "Hello KafkaJS user from 4th partition !", partition: 4 },
      ],
    });
    await producer.disconnect();
    return c.text("Message produced successfully");
  } catch (error) {
    console.error("Error creating topic:", error);
    return c.text("Failed to produce message", 500);
  }
});

export default app;
