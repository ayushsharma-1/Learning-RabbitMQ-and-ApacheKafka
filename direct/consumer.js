const amqp = require("amqplib");

async function receiveMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "mail_exchange";
        const queue = "mail_queue";
        const routingKey = "send_mail";

        await channel.assertExchange(exchange, "direct", { durable: false });
        await channel.assertQueue(queue, { durable: false });
        await channel.bindQueue(queue, exchange, routingKey);

        console.log("Waiting for messages in queue:", queue);

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const messageContent = JSON.parse(msg.content.toString());
                console.log("📩 Received message:", messageContent);
                channel.ack(msg);
            }
        });
    } catch (err) {
        console.error("Error in consumer:", err);
    }
}

receiveMail();
