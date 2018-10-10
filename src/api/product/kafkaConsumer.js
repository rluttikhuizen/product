var kafka = require('kafka-node');

const client = new kafka.Client("localhost:2181");


const topics = [
    {
        topic: "product"
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
      try {
          var buf = new Buffer(message.value, "binary");
          //var decodedMessage = JSON.parse(buf.toString());
          var decodedMessage = buf.toString();
          console.log("received message", decodedMessage);
        } catch (e) {
            console.log("Error in message" + e);
       }
});

consumer.on("error", function(err) {
    console.log("error", err);
});

process.on("SIGINT", function() {
  console.log("Critical error");
    consumer.close(true, function() {
        process.exit();
    });
});
