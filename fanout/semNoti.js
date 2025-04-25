const amqp = require("amqplib");

const smNoti = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "NotifyProducts";
    const exchangeType = "fanout";

    // Assert exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    // Assert a temporary, exclusive queue
    const { queue } = await channel.assertQueue("", { exclusive: true });

    // Bind queue to the exchange
    await channel.bindQueue(queue, exchange, "");

    console.log("[*] Waiting for messages in queue: . To exit press CTRL+C",queue);

    // Consume messages
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log(`📲 Sending SMS:`, message);
        channel.ack(msg);
      }
    });

  } catch (err) {
    console.error("❌ Error in smNoti:", err);
  }
};

smNoti();
