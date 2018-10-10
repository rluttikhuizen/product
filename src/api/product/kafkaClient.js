var kafka = require('kafka-node');
var kafkaServerHost ='localhost';
var kafkaServerPort =9092;
var Producer = kafka.Producer;
//var client = new kafka.Client("localhost:2181");


console.log("Kafka Producer is running");

console.log("Starting Kafka Client on 144.21.68.231:9092");
const client = new kafka.Client("144.21.68.231:9092", "my-client-id", {
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
	console.log(messageKafka);
  	//producer = new Producer(client);

	/*const event = {
            id: uuid.v4(),
            timestamp: Date.now(),
            userId: "sertac",
            data: 'test'
        };*/

        const buffer = new Buffer.from(JSON.stringify(messageKafka));
	//const buffer = new Buffer.from("Test from nodejs");

  	// Create a new payload
        const record = [
            {
                topic: "customers",
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
