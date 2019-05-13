const mongoose = require('mongoose');
const validator = require('validator');
// middleware let us customize treat of mongoose
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// for removing whole tasks after user delete by middleware
const Task = require('./task');

//mongoose convert sec params of model to schema behind scene
//by schema we can use middle ware functiuonality of monggose
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  },
  //track token by server we find it in good hand we store it
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
  },
  {
    timestamps: true
  }
);

// -----------------VIRTUAL -----------------------
//relation ship between 2 entities its not change anything 
//just for mongooose to find how related things are
//ref of tasks save on db but this not
//lf is relation ff is name of field in other model maintain info
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

//-------------------SEND PUBLIC INFO -----------------
//because user of this no arrow func
// send do stringify behind scene and before that we use tojson to can manipulate that
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject(); //provided by mongoose
  delete userObj.password;
  delete userObj.tokens;
  return userObj;
}

//-------------------JWT GENERATE ---------------------
//standard func because of binding value of this;
//setup login bring back auth token  - jsonwebtoken
//methods are accessible by instances
userSchema.methods.generateAuthToken = async function () {
  const user = this; //payload,id - secret - obj expire
  const token = jwt.sign({
    _id: user._id.toString()
  }, 'thisismycode')
  //add generated token to array of tokens and save ans use it
  user.tokens = user.tokens.concat({
    token
  });
  //and also shows up in db
  await user.save();
  return token;
}

//------------------- LOGIN VERIFY --------------------
//by set here we can access this method directly from User obj
//statics are accessible by model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    email
  });
  if (!user) throw new Error('unable to login');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('unable to login')

  return user;
}

// ----------------------- HASH PLAIN TEXT BEFORE sAVE ---------
//by change this old way to use schema we can use middleware
//need standard func ,,, this = is a doc , user
//some mongoose api doesn't bypass and don't run for update.
//pre and post for events on
userSchema.pre('save', async function (next) {
  const user = this;
  // if pass changed or init
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  //end
  next();
});
//---------------------DELETE TASKS OF DELETED USER ----------
userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({
    owner: user._id
  });
  next();
})

//--------------------- MODAL CREATION --------------------
const User = mongoose.model('User', userSchema);

module.exports = User;