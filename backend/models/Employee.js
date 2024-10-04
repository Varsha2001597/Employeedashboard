
const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;

// models/Employee.js



const employeeSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true, // Ensure id is unique
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  courses: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-incrementing ID logic
employeeSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: 'employeeId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter.seq;
    } catch (error) {
      console.error('Error generating employee ID:', error);
      next(error);
    }
  }
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
