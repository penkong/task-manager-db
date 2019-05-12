const express = require('express');
//-------------DB---------------------
const User = require('../models/user');
//...............................................
const auth = require('../middleware/auth'); // for add auth to routes
const router = new express.Router();
//----USER COLLECTION-----
//-----------------CREATE-------------------------
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({
      user,
      token
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

//------------------READ---------------------
//......for login verification
//relate to auth
router.post('/users/login', async (req, res) => {
  try {
    // user reusable code.
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({
      user,
      token
    });
  } catch (e) {
    res.status(400).send();
  }
})
//relate to auth 
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    })
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
})
//relate to auth 
router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
})

//relate to auth
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
  // try {
  //   const users = await User.find({});
  // } catch (e) {
  //   res.status(500).send();
  // }
  // User.find({}).then((users) => {
  //   res.send(users);
  // }).catch((e) => {
  //   res.status(500).send();
  // })
})

//----------------- UPDATE ----------------------
router.patch('/users/me', auth, async (req, res) => {
  //check related input head to already exist collection 
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({
    error: 'invalid Input for update.'
  });
  // now check related are mean or not. 
  try {
    // const user = await User.findById(req.user);
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    // this bypass mongoose find by id and update and effect directly on db.
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // })
    // if (!user) return res.status(404).send();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
})

//------------------DELETE---------------------
router.delete('/users/me', auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id)
    // if (!user) return res.status(404).send();
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
})





module.exports = router;
// for postman test dynamic token
// if(pm.response.code === 200){
//   pm.environment.set('authToken',pm.response.json().token)
// }

// router.get('/users/:id', async (req, res) => {
//   //mongoose change string id to obj by itself thnx mongooose.
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) return res.status(404).send();
//     res.send(user);
//   } catch (error) {
//     res.status(500).send();
//   }
//   // const _id = req.params.id;
//   // User.findById(_id).then((user) => {
//   //   if (!user) {
//   //     return res.status(404).send();
//   //   }
//   //   res.send(user);
//   // }).catch((e) => {
//   //   res.status(500).send();
//   // })
// })