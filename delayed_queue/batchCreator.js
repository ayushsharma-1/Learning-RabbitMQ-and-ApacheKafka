const amqp = require('amqplib');

async function batchCreate() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  const queue = 'batch_creation';

  await ch.assertQueue(queue);
  const order = { orderId: 'A1243', items: ['sds', 'sdssd'], status:"Placed" };
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
  console.log('✅ Batch Created:', order);
  
  setTimeout(() => conn.close(), 500);
}

batchCreate();
