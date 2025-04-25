const amqp = require("amqplib");

async function sendMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "mail_exchange";
        const routingKey = "send_mail";
        const message = {
            to: "realtime@gmail.com",
            from: "ayushsharma18001@gmail.com",
            subject: "update",
            body: "lets go"
        };

        await channel.assertExchange(exchange, "direct", { durable: false });
        await channel.assertQueue("mail_queue", { durable: false });
        await channel.bindQueue("mail_queue", exchange, routingKey);

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
        console.log("Message sent:", message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (err) {
        console.log(err);
    }
}

sendMail();
