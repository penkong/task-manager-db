const express = require('express');
//------------Multer-uploader------
const multer = require('multer');
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
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
})

//------------------DELETE---------------------
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
})

// ----------------UploadER MULTER --------------------
//we use form -data , create endpoint , put middlew of multer
const upload = multer({ 
  limits : {
    fileSize : 1000000
  },
  fileFilter(req,file,cb){
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('please upload a picture.'))
    }
    cb(undefined,true);
  }
}); //images, pdf ,...
//.............route for post.........middlew ... name server know for upload...
router.post('/users/me/avatar',auth ,upload.single('avatar'), async (req,res)=>{
  //when we remove dest multer let us save file on db otherwise folder get it
  //it give us buffer we must define store sys
  req.user.avatar = req.file.buffer;
  await req.user.save();
  res.send();
} ,(error, req, res, next)=>{
  res.status(400).send({error : error.message});
}) //these error handler func cause we send back json instead of html

//...................FETCH AVATAR BACK FOR SHOW AS URL.......
router.get('/users/:id/avatar', async (req,res)=>{
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error();
    //real magic make loadable img
    //by set we define header for res normally 'application/json'
    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
})


//.....................DELETE AVATAR ...........................
router.delete('/users/me/avatar', auth , async (req,res)=>{
  //when we remove dest multer let us save file on db otherwise folder get it
  //it give us buffer we must define store sys
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
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