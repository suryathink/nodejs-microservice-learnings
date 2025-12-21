import { serve } from "bun";
import { Hono } from "hono";
import { connectToRabbitMQ } from "./config/rabitmq.config";

const app = new Hono();



connectToRabbitMQ()
  .then(({ channel }) => {

    app.post('/book/:id', async (c)=>{
      const bookingId = c.req.param('id');
      const {name} = c.req.json();
      try {
        const bookingDetails = {id : bookingId, name, status :"PENDING"}
        // db operation
        // checking, tickets availabilty
        // reserving tickets
        // saving booking with PENDING status

        // publish message to queue
        await channel.sendToQueue('paymentQueue', Buffer.from(JSON.stringify(bookingDetails)), {persistent : true}); // we send data in bufffer to rabbit mq

        return c.json({
          message:"Booking initiated", bookingDetails
        }, 202)
      } catch (error) {
        console.error('Error processing booking:', error);
        return c.json({message: 'Failed to process booking'} , 500)
      }

    })


    channel.consume('booking.compensationQueue', async(msg) => {
      if (msg){
        const bookingDetails = JSON.parse(msg.content.toString());
        console.log(`Received compensation for booking ID: ${bookingDetails.id}`)
        // Handle compensating logic here, e.g., update booking status in DB
        channel.ack(msg)
      }
    })
    channel.consume('book.successQueue', async(msg) => {
      if (msg){
        const bookingDetails = JSON.parse(msg.content.toString());
        console.log(`Booking successful for booking ID: ${bookingDetails.id}`)
        // Handle success logic here in DB, e.g., update booking status to success in DB
        channel.ack(msg)
      }
    })

    const server = serve({
      fetch: app.fetch,
      port: 3000,
    });

    
    
    console.log(`Server running on http://localhost:${server.port}`);
  })
  .catch((error) => {
    console.error("Error connecting to RabbitMQ:", error);
  });
