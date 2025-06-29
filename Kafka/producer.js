const {Kafka} = require('./client');
async function init(){
    const producer = kafka.producer()

    await producer.connect()
    await producer.send({
    topic: 'test-topic',
    messages: [
        { 
            partition:1,
            key:"location-test",
            value: JSON.stringify({name:"Dhomdu", loc:"KNP"}),
        },
    ],
    })

    await producer.disconnect()
}
