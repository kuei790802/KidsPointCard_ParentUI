const mongoose = require("mongoose");

const behaviorSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  points: Number,
  tags: [String],
});

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  positiveBehaviors: [behaviorSchema],
  negativeBehaviors: [behaviorSchema],
});

module.exports = mongoose.model("Child", childSchema);
