// === Consumer: Service 3 (Comments/Likes) ===

const amqp = require("amqplib");
const service3 = async () => {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "service3Queue";
    const exchange = "NotifyExchange";
  
    await channel.assertExchange(exchange, "headers", { durable: true });
    await channel.assertQueue(queue, { durable: true });
  
    await channel.bindQueue(queue, exchange, "", {
      "x-match": "any",
      "notification-type-comment": "comment",
      "notification-type-like": "like"
    });
  
    channel.consume(queue, (msg) => {
      console.log("💬 [Service 3] Received:", msg.content.toString());
      channel.ack(msg);
    });
  };
  
service3();