const express = require('express');

//-------------DB---------------------
const User = require('../models/user');


//...............................................
const router = new express.Router();
//----USER COLLECTION-----
//-----------------CREATE-------------------------

router.post('/users', async (req, res) => {
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
router.get('/users', async (req, res) => {
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

router.get('/users/:id', async (req, res) => {
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

//----------------- UPDATE ----------------------
router.patch('/users/:id', async (req, res) => {
  //check related input head to already exist collection 
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({
    error: 'invalid Input for update.'
  });
  // now check related are mean or not. 
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
})

//------------------DELETE---------------------
router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id)
    if (!user) return res.status(404).send();
    res.send(user)
  } catch (e) {
    res.status(500).send();
  }
})





module.exports = router;