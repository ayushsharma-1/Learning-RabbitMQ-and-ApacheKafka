// === Consumer: Service 2 (Live Streams) ===
const amqp = require("amqplib");

const service2 = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "service2Queue";
  const exchange = "NotifyExchange";

  await channel.assertExchange(exchange, "headers", { durable: true });
  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(queue, exchange, "", {
    "x-match": "all",
    "notification-type": "live_stream",
    "content-type": "gaming"
  });

  channel.consume(queue, (msg) => {
    console.log("🎮 [Service 2] Received:", msg.content.toString());
    channel.ack(msg);
  });
};


service2();