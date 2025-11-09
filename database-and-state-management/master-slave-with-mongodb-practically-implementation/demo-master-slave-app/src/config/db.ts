import mongoose from "mongoose";

export const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri, {
      readPreference: "secondaryPreferred",
      monitorCommands:true,
    });

    const client = mongoose.connection.getClient();
        client.on("commandStarted", (event) => {
      console.log(
        `[MongoDB] Command ${event.commandName} sent to ${event.address}`
      );
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
