const express = require('express');

// we put main db file here to express can connect to it.
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
//...................................

const app = express();
const port = process.env.PORT || 3000;

//to parse incoming json to us by post to obj
app.use(express.json());


//----USER COLLECTION-----
//-----------------CREATE-------------------------

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }

  // user.save().then(() => {
  //   res.status(201).send(user);
  // }).catch((e) => {
  //   res.status(400).send(e);
  // });
});

//------------------READ---------------------
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
  // User.find({}).then((users) => {
  //   res.send(users);
  // }).catch((e) => {
  //   res.status(500).send();
  // })
})

app.get('/users/:id', async (req, res) => {
  //mongoose change string id to obj by itself thnx mongooose.
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
  // const _id = req.params.id;
  // User.findById(_id).then((user) => {
  //   if (!user) {
  //     return res.status(404).send();
  //   }
  //   res.send(user);
  // }).catch((e) => {
  //   res.status(500).send();
  // })
})




//----TASK COLLECTION-----
//------------------CREATE---------------------

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
  // task.save().then(() => {
  //   res.status(201).send(task);
  // }).catch((e) => {
  //   res.status(400).send(e);
  // });
});

//------------------READ---------------------
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
  // Task.find({}).then((tasks) => {
  //   res.send(tasks);
  // }).catch((e) => {
  //   res.status(500).send();
  // })
})

app.get('/tasks/:id', async (req, res) => {
  //mongoose change string id to obj by itself thnx mongooose.
  const _id = req.params.id;
  //find bring back whole doc but update bring a part
  try {
    const task = await Task.findById(_id);
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
  Task.findById(_id).then((task) => {
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  }).catch((e) => {
    res.status(500).send();
  })
})

//============== LISTEN SERVER ====================
app.listen(port, () => {
  console.log('server is up on port ' + port);
})