import dbConnect from '../utils/dbConnect';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Cors from 'cors';

// CORS configuration
const cors = Cors({
  origin: 'https://aidiary.online',
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
    const { username, password } = req.body;

    try {
      await dbConnect();

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).send("Kullanıcı bulunamadı.");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Şifre hatalı.");
      }

      const token = jwt.sign({ userId: user._id }, "12ksdfm230r4r9k3049k2w4prf", { expiresIn: '5d' });
      res.json({ token });
    } catch (error) {
      res.status(500).send("Giriş başarısız.");
    }
  } else if (req.method === 'OPTIONS') {
    // Handle OPTIONS preflight requests
    res.setHeader('Access-Control-Allow-Origin', 'https://aidiary.online');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end(); // No content for OPTIONS method
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
