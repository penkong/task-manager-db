const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({

// })
const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User'
  }
  // ref let lan models can easily fetch the entire user profile
  // populate let us know which user create which task bring profile by id
});

module.exports = Task;