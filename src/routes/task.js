const express = require('express');


//-------------DB---------------------
const Task = require('../models/task');
//------------auth middleware-------------
const auth = require('../middleware/auth');
//...............................................
const router = new express.Router();

//----TASK COLLECTION-----
//------------------CREATE---------------------

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
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
// add query string for filtering and sorting , not fetch all data
//limit=10 and &skip=0 -> give 0 to 10 if 10 give 10 to 20 for pagination
router.get('/tasks', auth, async (req, res) => {
  //filtering
  const match = {};
  if (req.query.completed) {
    //when type false or true in query its a string not boo
    match.completed = req.query.completed === 'true';
  }
  try {
    //populate from id bring profile
    // on limit what user input is not number it's string we cure
    await req.user.populate({
      path : 'tasks',
      match,
      options : {
        limit : parseInt(req.query.limit)
      }
    }).execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  //mongoose change string id to obj by itself thnx mongooose.
  const _id = req.params.id;
  //find bring back whole doc but update bring a part
  try {
    const task = await Task.findOne({
      _id,
      owner: req.user._id
    })
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
})

//----------------- UPDATE ----------------------
router.patch('/tasks/:id', auth, async (req, res) => {
  //check related input head to already exist collection 
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({
    error: 'invalid Input for update.'
  });
  // now check related are mean or not. 
  try {
    // const task = await Task.findById(req.params.id);
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // })
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) return res.status(404).send();
    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
})

//------------------DELETE---------------------
router.delete('/tasks/:id', auth, async (req, res) => {
  // const _id = req.params.id;
  // const task = await Task.findByIdAndDelete(_id)
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })
    if (!task) return res.status(404).send();
    res.send(task)
  } catch (e) {
    res.status(500).send();
  }
})

module.exports = router;