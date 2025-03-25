import Diary from '../models/Diary';
import jwt from 'jsonwebtoken';
import Cors from 'cors';
import User from '../models/User';
// CORS configuration
const cors = Cors({
  origin: 'https://diary-ai-0.vercel.app',
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
  
    if (req.method === 'GET') {
      const { username } = req.query;  // Get username from query params
  
      if (!username) {
        return res.status(403).send('Username is required.');
      }
  
      try {
        // Assuming you're fetching the user from the database using username
        const user = await User.findOne({ username });
  
        if (!user) {
          return res.status(404).send('User not found');
        }
  
        // Now fetch the diaries based on userId
        const entries = await Diary.find({ userId: user._id }).sort({ date: -1 });
        res.json(entries);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve diaries.' });
      }
    } else if (req.method === 'OPTIONS') {
      // Handle OPTIONS preflight requests
      res.setHeader('Access-Control-Allow-Origin', 'https://diary-ai-0.vercel.app');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.status(204).end(); // No content for OPTIONS method
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  