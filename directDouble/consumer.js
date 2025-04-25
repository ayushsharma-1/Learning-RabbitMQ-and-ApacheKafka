const amqp = require("amqplib");

async function receiveMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "mail_exchange";
        const queue1 = "mail_subqueue";
        const queue2 = "mail_unsubqueue";
        const routingKeySub = "sub_mail";
        const routingKeyUnSub = "unsub_mail";

        await channel.assertExchange(exchange, "direct", { durable: false });

        await channel.assertQueue(queue1, { durable: false });
        await channel.bindQueue(queue1, exchange, routingKeySub);

        await channel.assertQueue(queue2, { durable: false });
        await channel.bindQueue(queue2, exchange, routingKeyUnSub);

        console.log("Waiting for messages in queue:", queue1);
        console.log("Waiting for messages in queue:", queue2);

        channel.consume(queue1, (msg) => {
            if (msg !== null) {
                const messageContent = JSON.parse(msg.content.toString());
                console.log("📩 Received SUB message:", messageContent);
                channel.ack(msg);
            }
        });

        channel.consume(queue2, (msg) => {
            if (msg !== null) {
                const messageContent = JSON.parse(msg.content.toString());
                console.log("📭 Received UNSUB message:", messageContent);
                channel.ack(msg);
            }
        });

    } catch (err) {
        console.error("Error in consumer:", err);
    }
}

receiveMail();
