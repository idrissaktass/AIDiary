import dbConnect from '../utils/dbConnect'; // Ensure the database connection is established
import jwt from 'jsonwebtoken';
import User from '../models/User';
import WeeklyAnalysis from '../models/WeeklyAnalysis';
import Cors from 'cors';

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

// Helper method to verify the token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "12ksdfm230r4r9k3049k2w4prf", (err, decoded) => {
      if (err) return reject('Geçersiz token.');
      resolve(decoded);
    });
  });
};

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).send("Token is required.");
    }

    try {
      // Connect to the database
      await dbConnect();

      // Verify the token and decode it
      const decoded = await verifyToken(token);

      // Find the user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).send("Kullanıcı bulunamadı.");
      }

      // Fetch the user's weekly analyses
      const weeklyAnalyses = await WeeklyAnalysis.find({ userId: decoded.userId })
        .sort({ date: -1 })  // Sort by most recent date
        .limit(10);  // Limit to 10 results

      // Format the response
      const formattedAnalyses = weeklyAnalyses.map(analysis => ({
        id: analysis._id,
        date: analysis.date,
        analysis: analysis.analysis
      }));

      // Return the weekly analyses
      res.json(formattedAnalyses);
    } catch (error) {
      console.error("Haftalık analizleri çekerken hata:", error);
      res.status(500).json({ error: "Haftalık analizler getirilemedi." });
    }
  } else if (req.method === 'OPTIONS') {
    // Handle OPTIONS preflight requests
    res.setHeader('Access-Control-Allow-Origin', 'https://diary-ai-0.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end(); // No content for OPTIONS method
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
