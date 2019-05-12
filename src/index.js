const express = require('express');
const router = new express.Router()
//----------------DATABASE------------------------
// we put main db file here to express can connect to it.
require('./db/mongoose');
//----------------ROUTES -----------------
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

//...................................
const app = express();
const port = process.env.PORT || 3000;

//to parse incoming json to us by post to obj
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

//============== LISTEN SERVER ====================
app.listen(port, () => {
  console.log('server is up on port ' + port);
})