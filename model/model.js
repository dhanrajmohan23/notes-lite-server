const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    age: {
      required: true,
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Data", dataSchema);
