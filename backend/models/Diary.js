const mongoose = require("mongoose");

const DiarySchema = new mongoose.Schema({
  text: { type: String, required: true },
  mood: { type: String, required: true },
  happinessScore: { type: Number, min: 0, max: 10 },
  stressScore: { type: Number, min: 0, max: 10 },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  additionalEmotions: { 
    type: Object, 
    of: Number,  // A map where keys are emotions and values are their respective scores
    required: false 
  },

});

module.exports = mongoose.model("Diary", DiarySchema);
