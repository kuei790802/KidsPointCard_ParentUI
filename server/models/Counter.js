const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  positive: {
    type: Number,
    default: 3
  },
  negative: {
    type: Number,
    default: 3
  }
});

module.exports = mongoose.model("Counter", counterSchema);
