var kafka = require('kafka-node');

const client = new kafka.Client("144.21.68.231:9092");


const topics = [
    {
        topic: "customers"
    }
];
const options = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: "buffer"
};

const consumer = new kafka.HighLevelConsumer(client, topics, options);
console.log("Consumer is started");

consumer.on("message", function(message) {

    	//Read string into a buffer.
    	var buf = new Buffer(message.value, "binary");
    	var decodedMessage = JSON.parse(buf.toString());
    	//var decodedMessage = buf.toString();
    	console.log("received message id: ", decodedMessage.id);

   	 /*Events is a Sequelize Model Object.
    	return Events.create({
        	id: decodedMessage.id,
        	type: decodedMessage.type,
        	userId: decodedMessage.userId,
        	sessionId: decodedMessage.sessionId,
        	data: JSON.stringify(decodedMessage.data),
        	createdAt: new Date()
    	});*/
  	//console.log("received message", message);
});

consumer.on("error", function(err) {
    console.log("error", err);
});

process.on("SIGINT", function() {
    consumer.close(true, function() {
        process.exit();
    });
});
