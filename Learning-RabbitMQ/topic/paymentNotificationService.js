const amqp = require('amqplib');

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'paymentNotifications';
        const exchange = 'notification_exchange';
        const exchangeType = 'topic';


        await channel.assertQueue(queue, { durable: true });
        await channel.assertExchange(exchange, exchangeType, { durable: true });
        await channel.bindQueue(queue, exchange, 'payment.*'); 


        console.log(`Waiting for messages in queue: ${queue}`);
        channel.consume(queue, (message) => {
            if (message !== null) {
                const content = message.content.toString();
                console.log(`Received: ${content}`);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

connectRabbitMQ();