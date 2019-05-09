//npm mongodb crud operation with mongodb driver
//const mongodb = require('mongodb');
// mongo client give us functions that we need to connect to db to crud.
//const MongoClient = mongodb.MongoClient;
//grab from mongodb allow us work with object ids 
//const ObjectID = mongodb.ObjectID;
const {
  MongoClient,
  ObjectID
} = require('mongodb');

//-----------------------------
const connectUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';
//------------------------------------
//to generate our own ids -12byte value - 4sec gettimestamp- 5 random - 3 random value
// const id = new ObjectID();
// console.log(id.id);
// console.log(id.getTimestamp());

//-----------------------
MongoClient.connect(connectUrl, {
  useNewUrlParser: true
}, (error, client) => {
  if (error) {
    return console.log('unable to connect to db');
  }
  const db = client.db(dbName);
  //first collection
  // db.collection('consumers').insertOne({
  //   _id: id,
  //   name: 'lendo',
  //   age: 25
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('unable to insert documents');
  //   }
  //   console.log(result.ops);
  // });

  // 
});
// //second collection
// db.collection('tasks').insertMany([{
//     description: 'do mongodb course',
//     completed: true
//   },
//   {
//     description: 'do nodejs course',
//     completed: true
//   },
//   {
//     description: 'do webpack course',
//     completed: true
//   }
// ], (error, result) => {
//   if (error) {
//     return console.log('unable to insert documents');
//   }
//   console.log(result.ops);
// });

// // give you back db reference
// const db = client.db(dbName);
// //tables vs collections
// db.collection('consumers').insertOne({
//   name: 'mkz',
//   age: 30
// }, (error, result) => {
//   if (error) {
//     return console.log('unable to insert consumers');
//   }
//   //ops(arr of inserted info) props of consumers
//   console.log(result.ops);
// })