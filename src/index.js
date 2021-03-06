const express = require('express');
//----------------DATABASE------------------------
// we put main db file here to express can connect to it.
require('./db/mongoose');
//----------------ROUTES -----------------
//all routes become 2 kinds , public or authenticated routs
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
// const sendGrid = require('../../config/dev');
//...................................
const app = express();
const port = process.env.PORT || 3000;

//middleware check auth run between req come to server or route once handler

//to parse incoming json to us by post to obj
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//============== LISTEN SERVER ====================
app.listen(port, () => {
  console.log('server is up on port ' + port);
})