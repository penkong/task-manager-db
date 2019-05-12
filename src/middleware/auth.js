// //middleware check auth run between req come to server or route once handler
// //this middleware is for auth usage to sit before routs to check
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer', '');
//     const decoded = jwt.verify(token, 'thisismycode');
//     const user = await User.findOne({
//       _id: decoded._id,
//       'tokens.token': token
//     });
//     if (!user) {
//       throw new Error();
//     }
//     req.user = user;
//     next();
//   } catch (e) {
//     res.status(401).send({
//       error: 'Please authenticate.'
//     })
//   }
// }

// module.exports = auth;


const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, 'thisismycode')
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    })

    if (!user) {
      throw new Error()
    }
    req.token = token;
    req.user = user;
    next()
  } catch (e) {
    res.status(401).send({
      error: 'Please authenticate.'
    })
  }
}

module.exports = auth