const amqp = require('amqplib');

async function orderProcessing() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();

  const inputQueue = 'batch_creation';
  const exchange = 'delayed_exchange';
  const delayQueue = 'delayed_queue';

  // Setup delayed queue with TTL and dead-lettering
  await ch.assertExchange(exchange, 'direct', { durable: true });

  await ch.assertQueue(delayQueue, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': '', // default exchange
      'x-dead-letter-routing-key': 'final_queue',
      'x-message-ttl': 10000 // 10 sec delay
    }
  });

  await ch.bindQueue(delayQueue, exchange, 'delay');

  await ch.assertQueue(inputQueue);

  ch.consume(inputQueue, msg => {
    const order = JSON.parse(msg.content.toString());
    console.log('🔄 Order Processing:', order);

    // Send to delay queue
    ch.publish(exchange, 'delay', Buffer.from(JSON.stringify(order)));
    ch.ack(msg);
  });

  console.log('🚀 Waiting for orders to process...');
}

orderProcessing();
