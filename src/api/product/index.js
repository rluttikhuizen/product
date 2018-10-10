const express = require('express')
const app = express()
const port = 3000;
var kafkaPublisher = require("./kafkaClient.js");
var kafkaConsumer = require("./kafkaConsumer.js");

const MongoClient = require('mongodb').MongoClient;

// To test locally
//const mongoUrl = "mongodb://localhost:27017/";

// To test using Docker
const mongoUrl = "mongodb://product-db:27017/";

let db;
var ObjectID = require('mongodb').ObjectID;


app.use(require('body-parser').json());
app.listen(port, ()=>{console.log('server started on: ' + port)});

MongoClient.connect(mongoUrl, (err, database) => {
  if(err) console.log(err);
  db = database.db('TestDb');

});


app.get('/helloWorld', (req, res) => res.send({ express: 'Hello From Express' }))

app.get('/listProducts',function(req, res){
  console.log('List Products');
  db.collection('Products').find().toArray((err, result) => {
    if (err) return console.log(err);
    res.json(result);
  });

});

app.get('/productById',function(req, res){
  console.log('productId: ' +req.query.productId);
  var query = { productId: parseInt(req.query.productId) };
  db.collection('Products').findOne(query, function(err, result) {
    res.json(result);
  });

});

app.put('/product', function(req,res){
  console.log(req.body);
  console.log('id: ' + req.body._id);
  var query = { '_id': ObjectID(req.body._id) };
  var newvalues = { $set: {'productName': req.body.productName, 'price': req.body.price } };
  db.collection('Products').update(query, newvalues, function(err, result) {
    if (err) throw err;
    res.json({message:"Product is updated"});
  });
});

app.put('/withdrawProductById',function(req, res){
  let resultGet;
  console.log('productId: ' +req.query.productId);
  var query = { productId: parseInt(req.query.productId) };
  db.collection('Products').findOne(query, function(err, result) {
    resultGet = result;
    console.log('Withdraw is started');
    console.log('_id: ' +resultGet._id);
    query = { _id:  ObjectID(resultGet._id) };
    var newvalues = { $set: {'available': false} };
    db.collection('Products').update(query, newvalues, function(err, result) {
      if (err) throw err;
      res.json({message:"Product is withdrawed"});
    });
  });
});

app.delete('/product', function(req,res){
  var query = { _id:  ObjectID(req.query._id) };
  db.collection('Products').deleteOne(query, function(err, result) {
    if (err) throw err;
    res.json({message:"Product is deleted"});
  });

});

app.post('/product', function(req, res){
  console.log(req.body);

  db.collection('Products').save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to database');
    res.json({message:"Product is saved"});
  });
  kafkaPublisher.sendMessageKafka(req.body);
});
