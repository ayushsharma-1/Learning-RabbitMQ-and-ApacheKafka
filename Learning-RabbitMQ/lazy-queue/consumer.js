const amqp = require('amqplib');


async function consume() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        
        const queue = 'lazy-queue';
        // const exchange = "lazy-noti-exchange";
        await channel.assertQueue(queue, {
            durable: true,
            arguments: { 'x-queue-mode': 'lazy' }
        });

        console.log(`Waiting for messages in queue: ${queue}`);
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                console.log(`Received: ${msg.content.toString()}`);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

consume();