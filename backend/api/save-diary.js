import Diary from '../models/Diary';
import jwt from 'jsonwebtoken';
import Cors from 'cors';
import dbConnect from '../utils/dbConnect'; // dbConnect'i dahil et

// CORS middleware'ini sadece belirli metodlar ve kökenle sınırlamak
const cors = Cors({
  origin: 'https://aidiary.online', // Güvenli bir origin belirleyin
  methods: ['POST', 'OPTIONS'], // Sadece kullanılan metodları dahil edin
  allowedHeaders: ['Content-Type', 'Authorization'], // Yalnızca gerekli başlıklar
  credentials: true, // Gerekliyse kullanıcı kimlik doğrulama bilgilerini taşı
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
  await runMiddleware(req, res, cors); // CORS middleware'ini çalıştır

  if (req.method === 'OPTIONS') {
    // Handle OPTIONS preflight requests
    res.setHeader('Access-Control-Allow-Origin', 'https://aidiary.online');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end(); // No content for OPTIONS method
    return;
  }

  if (req.method === 'POST') {
    const { text, mood, happinessScore, stressScore, additionalEmotions, token } = req.body;

    if (!token) {
      return res.status(403).send('Token is required.');
    }

    try {
      // Veritabanı bağlantısını sağla
      await dbConnect();

      const decoded = jwt.verify(token, "12ksdfm230r4r9k3049k2w4prf");

      function parseEmotions(emotionsString) {
        const emotions = {};
        emotionsString.split(',').forEach(pair => {
          const [key, value] = pair.split(':').map(item => item.trim());
          if (key && !isNaN(value)) {
            emotions[key] = parseInt(value, 10); // Convert value to integer
          }
        });
        return emotions;
      }
      const additionalEmotionsObject = parseEmotions(additionalEmotions);

      const newDiary = new Diary({
        text,
        mood,
        happinessScore,
        stressScore,
        additionalEmotions: additionalEmotionsObject, // Save as object
        userId: decoded.userId,
      });

      await newDiary.save();
      res.json({ message: 'Diary saved successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save diary.' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
