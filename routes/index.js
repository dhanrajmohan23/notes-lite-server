const express = require("express");
const router = express.Router();

//Post method
router.post("/post", (req, res) => {
  res.send("Post Api");
});

// Get all method
router.get("/getAll", (req, res) => {
  res.send("Get All API");
});

// Get by ID Method
router.get("getOne/:id", (req, res) => {
  res.send("Get by ID API");
});

// Update by ID Method
router.patch("/update/:id", (req, res) => {
  res.send("Update by ID API");
});

// Delete by ID Method
router.delete("/delete/:id", (req, res) => {
  res.send("Delete by ID Api");
});

module.exports = router;
