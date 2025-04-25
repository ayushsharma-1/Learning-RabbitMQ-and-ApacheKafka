const amqp = require("amqplib");

const pushNoti = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "NotifyProducts";
    const exchangeType = "fanout";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    // Create an exclusive, auto-delete queue for this consumer
    const { queue } = await channel.assertQueue("", { exclusive: true });

    // Bind the queue to the exchange
    await channel.bindQueue(queue, exchange, "");

    console.log(` [*] Waiting for messages in queue: ${queue}. To exit press CTRL+C`);

    // Start consuming messages
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log(`📩 Push Notification Received:`, message);
        channel.ack(msg);
      }
    });

  } catch (err) {
    console.error("❌ Error in pushNoti:", err);
  }
};

pushNoti();
