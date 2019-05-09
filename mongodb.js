//npm mongodb crud operation with mongodb driver
const mongodb = require('mongodb');
// mongo client give us functions that we need to connect to db to crud.
const MongoClient = mongodb.MongoClient;

const connectUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';

MongoClient.connect(connectUrl, {
  useNewUrlParser: true
}, (error, client) => {
  if (error) {
    return console.log('unable to connect to db');
  }
  // give you back db reference
  const db = client.db(dbName);
  //tables vs collections
  db.collection('consumers').insertOne({
    name: 'mkz',
    age: 30
  });
});