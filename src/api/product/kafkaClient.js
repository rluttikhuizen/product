var kafka = require('kafka-node');
//var kafkaServerHost ='localhost';
//var kafkaServerPort =9092;
var Producer = kafka.Producer;
//var client = new kafka.Client("localhost:2181");
var topic = "product";


console.log("Kafka Producer is running");
const client = new kafka.Client("localhost:2181", "my-client-id", {
    sessionTimeout: 300,
    spinDelay: 100,
    retries: 2
});

const producer = new kafka.HighLevelProducer(client);
producer.on("ready", function() {
    console.log("Kafka Producer is connected and ready.");
});

// For this demo we just log producer errors to the console.
producer.on("error", function(error) {
    console.error(error);
});

exports.sendMessageKafka = function (messageKafka) {
  	console.log("Producer is starting");
  	//producer = new Producer(client);

	/*const event = {
            id: uuid.v4(),
            timestamp: Date.now(),
            userId: "sertac",
            data: 'test'
        };*/

        //const buffer = new Buffer.from(JSON.stringify(event));
	const buffer = new Buffer.from("from windows");

  	// Create a new payload
        const record = [
            {
                topic: "product",
                messages: buffer,
                attributes: 1 /* Use GZip compression for the payload */
            }
        ];

        //Send record to Kafka and log result/error

	producer.send(record, function (err, data) {
        	console.log(data);
    	});
  	console.log("Producer finished");

}//sendMessageKafka
/*
exports.getMessageKafka = function () {
	//var client = new kafka.Client("localhost:9092/");
	var Consumer = kafka.Consumer;
	console.log("Consumer is starting");
	consumer = new Consumer(
         	client,
        	[
              		{ topic: 'test', partition: 0, offset: 0 }
        	],
        	{ fromOffset: 'earliest' }
    	);

	consumer.on('message', function (message) {
  		console.log("received message Client", message);
	});

	consumer.on('error', function (err) {
    		console.log('ERROR: ' + err.toString());
	});

}//getMessageKafka*/
