const amqp = require('amqplib');

async function delayedConsumer() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();

  const finalQueue = 'final_queue';
  await ch.assertQueue(finalQueue);

  ch.consume(finalQueue, msg => {
    const order = JSON.parse(msg.content.toString());

    order.status = 'Shipped';

    console.log('🚚 Order Status Updated:', order);
    ch.ack(msg);
  });

  console.log('⏳ Waiting for delayed messages...');
}

delayedConsumer();
