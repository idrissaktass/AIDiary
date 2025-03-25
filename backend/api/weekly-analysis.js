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
  origin: 'https://diary-ai-0.vercel.app', // Add your frontend URL here
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

      // Fetch the latest 3 diary entries
      const threeEntries = await Diary.find({ userId: decoded.userId }).sort({ date: -1 }).limit(3);
      if (threeEntries.length < 3) {
        return res.status(400).send('Need 3 diary entries for weekly analysis.');
      }

      // Prepare mood texts for OpenAI analysis
      const moodTexts = threeEntries.map(entry => entry.mood).join('\n');

      // Get analysis from OpenAI
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Sen bir ruh hali analizcisinsin.' },
          { role: 'user', content: `Lütfen bu 3 ruh hali analizini gözden geçir ve genel bir ruh hali değerlendirmesi yap. Değerlendirmeyi sunarken bir mesaja cevap verir gibi sunma, rapor gibi yaz. ${moodTexts}` },
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
