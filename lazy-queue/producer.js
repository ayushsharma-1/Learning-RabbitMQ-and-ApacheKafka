const amqp = require('amqplib');

async function publishMessages() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queueName = 'lazy-queue';
    const exchange = "lazy-noti-exchange";
    const routingKey = "noti.lazy.key";

    // Declare an exchange
    await channel.assertExchange(exchange, 'direct', { durable: true });

    // Declare a lazy queue
    await channel.assertQueue(queueName, {
        durable: true,
        arguments: { 'x-queue-mode': 'lazy' } // Set the queue mode to lazy
    });

    // Bind the queue to the exchange with a routing key
    await channel.bindQueue(queueName, exchange, routingKey);

    const messages = ['Message 1', 'Message 2', 'Message 3'];

    messages.forEach((msg) => {
        channel.publish(exchange, routingKey, Buffer.from(msg), { persistent: true });
        console.log(`Sent: ${msg}`);
    });

    setTimeout(() => {
        connection.close();
        console.log('Connection closed');
    }, 500);
}

publishMessages().catch((err) => {
    console.error('Error:', err);
});