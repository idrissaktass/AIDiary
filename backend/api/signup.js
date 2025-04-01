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
    const { username, email, password } = req.body;
  
    try {
      await dbConnect();
  
      // Email ve Kullanıcı Adı Kontrolü
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "email zaten var" });
      }
  
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: "username zaten var" });
      }
  
      // Şifreyi hash'le
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Kullanıcı oluştur
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
  
      // JWT Token oluştur
      const token = jwt.sign(
        { userId: newUser._id, username: newUser.username },
        "12ksdfm230r4r9k3049k2w4prf",
        { expiresIn: '5d' }
      );
  
      res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
   else if (req.method === 'OPTIONS') {
    // Handle OPTIONS preflight requests
    res.setHeader('Access-Control-Allow-Origin', 'https://aidiary.online');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end(); // No content for OPTIONS method
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
