const mongoose = require("mongoose");

const DiarySchema = new mongoose.Schema({
  text: String,
  mood: String,
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Diary", DiarySchema);
