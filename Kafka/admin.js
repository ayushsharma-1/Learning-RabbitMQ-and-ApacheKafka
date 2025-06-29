const { kafka } = require('./client');

async function init() {
	const admin = kafka.admin();
	console.log("Admin Connecting..");

	await admin.connect(); 

	console.log("Admin Connected");
	console.log("Creating Test-Topic...");

	await admin.createTopics({
		topics: [
			{ topic: 'test-topic', numPartitions: 2 },
		],
	});

	console.log("Test-Topic Created Successfully");

	await admin.disconnect();
	console.log("Admin Disconnected");
}

init().catch(console.error);
