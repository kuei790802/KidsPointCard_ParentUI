const express = require("express");
const router = express.Router();
const Child = require("../models/Point");

// Get all children data
router.get("/", async (req, res) => {
  try {
    const children = await Child.find();
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific child's data
router.get("/:name", async (req, res) => {
  try {
    const child = await Child.findOne({ name: req.params.name });
    if (child) {
      res.json(child);
    } else {
      res.status(404).json({ message: "Child not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update child data
router.post("/", async (req, res) => {
  try {
    const child = await Child.findOneAndUpdate(
      { name: req.body.name },
      req.body,
      { new: true, upsert: true }
    );
    res.status(201).json(child);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update child data
router.put("/:name", async (req, res) => {
  try {
    const child = await Child.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      { new: true }
    );
    if (child) {
      res.json(child);
    } else {
      res.status(404).json({ message: "Child not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
