const mongoose = require('mongoose');
const validator = require('validator');


//connect to db
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
});
//........................................................
const User = mongoose.model('User', {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const task = new Task({
  description: 'sss',
  completed: true
})

task.save()
  .then(() => {
    console.log(task);
  })
  .catch(() => {
    console.log('error', error);
  })

//.............................................
const User = mongoose.model('User', {
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

const me = new User({
  name: '',
  email: '',
  password: '',
  age: 4
})

me.save()
  .then(() => {
    console.log(task);
  })
  .catch(() => {
    console.log('error', error);
  })