const amqp = require("amqplib");

const sendMessage = async (type, data) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "NotifyProducts";
    const exchangeType = "fanout";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    const message = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    channel.publish(exchange, "", Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log(`📤 Sent Message: ${JSON.stringify(message)}`);

    // Close the connection after a short delay
    setTimeout(() => {
      connection.close();
    }, 500);

  } catch (err) {
    console.error("❌ Error in sendMessage:", err);
  }
};

sendMessage("product.created", {
  productID: "12345",
  name: "Product 1",
  price: 100
});
sendMessage("product.updated", {
  productID: "12345",
  name: "Product 1",
  price: 120
});
sendMessage("product.deleted", {
  productID: "12345",
  name: "Product 1",
  price: 120
});