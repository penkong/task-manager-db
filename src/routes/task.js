const express = require('express');


//-------------DB---------------------
const Task = require('../models/task');

//...............................................
const router = new express.Router();

//----TASK COLLECTION-----
//------------------CREATE---------------------

router.post('/tasks', async (req, res) => {
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
router.get('/tasks', async (req, res) => {
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

router.get('/tasks/:id', async (req, res) => {
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

//----------------- UPDATE ----------------------
router.patch('/tasks/:id', async (req, res) => {
  //check related input head to already exist collection 
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({
    error: 'invalid Input for update.'
  });
  // now check related are mean or not. 
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
})

//------------------DELETE---------------------
router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(_id)
    if (!task) return res.status(404).send();
    res.send(task)
  } catch (e) {
    res.status(500).send();
  }
})

module.exports = router;