import Diary from '../models/Diary';
import jwt from 'jsonwebtoken';
import Cors from 'cors';
import User from '../models/User';
import dbConnect from '../utils/dbConnect';

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
    
    // Connect to the database
    await dbConnect();
  
    if (req.method === 'GET') {
      console.log("girdi")
      const token = req.headers.authorization?.split(' ')[1]; // Extract token
  
      if (!token) {
        return res.status(403).send('Token is required.');
      }
  
      try {
        console.log("try")
        // Verify token and extract user ID
        const decoded = jwt.verify(token, "12ksdfm230r4r9k3049k2w4prf");
        const userId = decoded.id;
  
        // Fetch the user's diary entries from the database
        const entries = await Diary.find({ userId }).sort({ date: -1 });
        console.log("entries", entries)
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