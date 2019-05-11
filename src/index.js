const express = require('express');

// we put main db file here to express can connect to it.
require('./db/mongoose');
const User = require('./models/user');
//...................................


const app = express();

const port = process.env.PORT || 3000;


//to parse incoming json to us by post to obj
app.use(express.json());

app.post('/users', (req, res) => {
  const user = new User(req.body);
  user.save().then(() => {
    res.send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});






app.listen(port, () => {
  console.log('server is up on port ' + port);
})