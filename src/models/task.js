const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
  },
  {
    timestamps : true
  }
)
// ref let lan models can easily fetch the entire user profile
// populate let us know which user create which task bring profile by id
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;