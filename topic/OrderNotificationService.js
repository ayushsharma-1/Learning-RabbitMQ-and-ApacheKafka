const amqp = require('amqplib');

async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchange = 'notification_exchange';
        const exchangeType = 'topic';
        const queue = 'OrderNotifications';
        await channel.assertExchange(exchange, exchangeType, { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, 'order.*'); 

        
        console.log(`Waiting for messages in queue: ${queue}`);
        channel.consume(queue, (message) => {
            if (message !== null) {
                console.log(`Received: ${message.content.toString()}`);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

connectToRabbitMQ();