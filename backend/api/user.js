import dbConnect from '../utils/dbConnect';
import jwt from 'jsonwebtoken';
import User from '../models/User';
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

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Yetkilendirme başarısız." });

      const decoded = jwt.verify(token, "12ksdfm230r4r9k3049k2w4prf");
      await dbConnect();

      const user = await User.findById(decoded.userId).select("username email");
      if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });

      res.json({ username: user.username });
    } catch (error) {
      res.status(500).json({ error: "Sunucu hatası" });
    }
  } else if (req.method === 'OPTIONS') {
    // Handle OPTIONS preflight requests
    res.setHeader('Access-Control-Allow-Origin', 'https://diary-ai-0.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end(); // No content for OPTIONS method
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
