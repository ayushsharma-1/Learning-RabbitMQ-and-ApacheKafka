const amqp = require('amqplib');

async function consume() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const queue = 'priority_queue';

        await channel.assertQueue(queue, {
            durable: true,
            arguments: { "x-max-priority": 10 }
        });

        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                console.log(`Received message: ${msg.content.toString()}`);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

consume();