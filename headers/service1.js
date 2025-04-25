// === Consumer: Service 1 (New Videos) ===

const amqp = require("amqplib");
const service1 = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "service1Queue";
  const exchange = "NotifyExchange";

  await channel.assertExchange(exchange, "headers", { durable: true });
  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(queue, exchange, "", {
    "x-match": "all",
    "notification-type": "new_video",
    "content-type": "video"
  });

  channel.consume(queue, (msg) => {
    console.log("📺 [Service 1] Received:", msg.content.toString());
    channel.ack(msg);
  });
};

service1();