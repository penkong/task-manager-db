const mongoose = require('mongoose');
const validator = require('validator');
// middleware let us customize treat of mongoose
const bcrypt = require('bcrypt');

//mongoose convert sec params of model to schema behind scene

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowerCase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Please take safe password.');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('age must be a positive number');
      }
    }
  }
});
//by change this old way to use schema we can use middleware
//need standard func ,,, this = is a doc , user
//some mongoose api doesn't bypass and don't run for update.
userSchema.pre('save', async function (next) {
  const user = this;
  // if pass changed
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  //end
  next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;