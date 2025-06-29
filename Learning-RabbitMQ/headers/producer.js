// === Producer ===
const amqp = require("amqplib");

const sendNotification = async (message, headers) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "NotifyExchange";
    await channel.assertExchange(exchange, "headers", { durable: true });

    channel.publish(exchange, "", Buffer.from(message), { 
      persistent:true,
      headers 
    });

    console.log("📤 Message sent with headers:", headers);

    setTimeout(() => connection.close(), 500);
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

// Examples
sendNotification("🎥 New video uploaded!", {
  "x-match": "all",
  "notification-type": "new_video",
  "content-type": "video"
});

sendNotification("🎮 Live gaming stream started!", {
  "x-match": "all",
  "notification-type": "live_stream",
  "content-type": "gaming"
});

sendNotification("👍 Someone liked your video!", {
  "x-match": "any",
  "notification-type-like": "like"
});


