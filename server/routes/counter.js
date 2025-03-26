const express = require("express");
const router = express.Router();
const Counter = require("../models/Counter");

// Get counter
router.get("/", async (req, res) => {
  try {
    const counter = await Counter.findOne();
    if (counter) {
      res.json(counter);
    } else {
      // Create default counter if none exists
      const newCounter = await Counter.create({});
      res.json(newCounter);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update counter
router.post("/", async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    res.json(counter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
