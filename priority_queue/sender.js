const amqp = require("amqplib");

async function sendMessage() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "priority_exchange";
        const queue = "priority_queue";
        const routingKey = "priority_key";

        await channel.assertExchange(exchange, "direct", { durable: true });
        await channel.assertQueue(queue, {
            durable: true,
            arguments: { "x-max-priority": 10 }
        });
        await channel.bindQueue(queue, exchange, routingKey);

        // Data array with priority
        let data = [
            { message: "Low priority message", priority: 1 },
            { message: "Medium priority message", priority: 5 },
            { message: "High priority message", priority: 10 }
        ];

        // Optional: Sort data by priority (descending) before sending
        data.sort((a, b) => b.priority - a.priority);

        // Publish messages with priority
        data.forEach((msg) => {
            channel.publish(exchange, routingKey, Buffer.from(msg.message), { priority: msg.priority });
            console.log(`Sent message: ${msg.message} with priority ${msg.priority}`);
        });

        console.log("All messages sent");

        setTimeout(() => {
            connection.close();
        }, 1000); // Increased timeout to ensure all messages are sent
    } catch (err) {
        console.error("Error in sender:", err);
    }
}

sendMessage();