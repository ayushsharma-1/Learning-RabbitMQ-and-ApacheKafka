        const amqp = require("amqplib");

        async function sendMail() {
            try {
                const connection = await amqp.connect("amqp://localhost");
                const channel = await connection.createChannel();
                const exchange = "mail_exchange";
                const routingKeySub = "sub_mail";
                const routingKeyUnSub = "unsub_mail";
                const subMessage = {
                    to: "realtime@gmail.com",
                    from: "ayushsharma18001@gmail.com",
                    subject: "Welcome!",
                    body: "Thanks for subscribing!"
                };
                
                const unsubMessage = {
                    to: "realtime@gmail.com",
                    from: "ayushsharma18001@gmail.com",
                    subject: "Goodbye!",
                    body: "Sorry to see you go."
                };
                

                await channel.assertExchange(exchange, "direct", { durable: false });

                await channel.assertQueue("mail_subqueue", { durable: false });
                await channel.assertQueue("mail_unsubqueue", { durable:false});

                await channel.bindQueue("mail_subqueue", exchange, routingKeySub);
                await channel.bindQueue("mail_unsubqueue", exchange, routingKeyUnSub)

                channel.publish(exchange, routingKeySub, Buffer.from(JSON.stringify(subMessage)));
                channel.publish(exchange, routingKeyUnSub, Buffer.from(JSON.stringify(unsubMessage)));
                console.log("Message sent:", subMessage);
                console.log("Message sent:", unsubMessage);

                setTimeout(() => {
                    connection.close();
                }, 500);
            } catch (err) {
                console.log(err);
            }
        }

        sendMail();
