const amqp = require("amqplib");

const sendMessage = async (routingKey, message) => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const exchangeType = "topic";
        

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
        console.log(`📤 Sent message to ${routingKey}:`, message);
        console.log(`Message sent to exchange: ${exchange}, routing key: ${routingKey}`);
        console.log(`Message content: ${JSON.stringify(message)}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (err) {
        console.log(err);
    }
}

sendMessage("order.palced",{orderIDd : "12345", userID: "67890", status: "placed"});
sendMessage("payment.processed",{orderIDd : "12345", userID: "67890", status: "processesd"});
