import dbConnect from '../utils/dbConnect';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Diary from '../models/Diary';
import WeeklyAnalysis from '../models/WeeklyAnalysis';
import { OpenAI } from 'openai';
import Cors from 'cors';

// OpenAI API key and instance
const openai = new OpenAI({
  apiKey: "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",
});

// CORS configuration
const cors = Cors({
  origin: 'https://aidiary.online', // Add your frontend URL here
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// Helper function to run middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).send('Token is required.');
    }

    try {
      // Verify token and get user data
      const decoded = jwt.verify(token, "12ksdfm230r4r9k3049k2w4prf");
      await dbConnect();

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).send('User not found.');
      }

      // Check if it's the user's first weekly analysis
      let lastAnalysisDate = user.lastWeeklyAnalysis;

      if (!lastAnalysisDate) {
        // If no last analysis date, use the first diary entry date
        const firstDiaryEntry = await Diary.findOne({ userId: decoded.userId }).sort({ date: 1 }); // Get the first diary entry
        if (!firstDiaryEntry) {
          return res.status(400).send('No diary entries found for this user.');
        }
        lastAnalysisDate = firstDiaryEntry.date; // Use the first diary entry's date for the analysis
      }

      // Fetch diary entries written after the last weekly analysis date
      const diariesSinceLastAnalysis = await Diary.find({
        userId: decoded.userId,
        date: { $gt: lastAnalysisDate }, // Only get diaries after the last analysis date
      });

      // Check if there are at least 3 diaries
      if (diariesSinceLastAnalysis.length < 3) {
        return res.status(400).send('Need 3 diary entries after the last weekly analysis for new analysis.');
      }

      // Prepare mood texts for OpenAI analysis
      const moodTexts = diariesSinceLastAnalysis.slice(0, 3).map(entry => entry.mood).join('\n');

      // Get analysis from OpenAI
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a mood analyst.' },
          { role: 'user', content: `Please review these 3 mood analyses and provide a general mood evaluation. When presenting the evaluation, avoid responding like a message, instead write it like a report, for example, do not start with phrases like "Sure! Here's the review of the three mood analyses:" ${moodTexts}` },
        ],
      });

      // Save weekly analysis
      const newWeeklyAnalysis = new WeeklyAnalysis({
        userId: decoded.userId,
        analysis: response.choices[0].message.content,
        date: new Date(),
      });

      await newWeeklyAnalysis.save();

      // Update user's last weekly analysis date
      user.lastWeeklyAnalysis = new Date();
      await user.save();

      // Send the analysis result to the client
      res.json({ weeklyAnalysis: response.choices[0].message.content });
    } catch (error) {
      console.error('Error during weekly analysis:', error);
      res.status(500).json({ error: 'Weekly analysis failed.' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
