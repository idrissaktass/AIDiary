const mongoose = require("mongoose");

const weeklyAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  analysis: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WeeklyAnalysis", weeklyAnalysisSchema);
