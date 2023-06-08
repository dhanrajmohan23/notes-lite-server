const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    note: {
      required: true,
      type: String,
    },
    category: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", notesSchema);
