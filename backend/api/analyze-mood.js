import { OpenAI } from 'openai';
import jwt from 'jsonwebtoken';
import dbConnect from '../utils/dbConnect';
import User from '../models/User';
import Cors from 'cors';

const openai = new OpenAI({
  apiKey: "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",
});

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
  await dbConnect();

  if (req.method === 'POST') {
    const { text } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).send('Token is required.');
    }

    try {
      const decoded = jwt.verify(token, "12ksdfm230r4r9k3049k2w4prf");

      // OpenAI request to analyze mood, happiness, and stress
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Sen bir ruh hali analizcisinsin.' },
          { role: "user", content: `Bu girdinin ruh hali nedir? Bir terapist gibi sade bir dil ile biraz ayrıntılı açıklama yap ve tavsiyeler ver. Mümkünse analizin sonuna bir quote ekle. Eğer anlamsız bir kelime veya anlamsız cümleler yazılmışsa analiz etme ve "Anladıysam arap olayım" yaz. Ayrıca, bu yazıya bir mutluluk ve stres puanı ver. Mutluluk puanı 1-10 arasında, stres puanı da 1-10 arasında olmalıdır. İşte yazı: ${text}` },
        ],
      });

      // Extract the mood, happiness score, and stress score from the response
      const analysis = response.choices[0].message.content;
      const happinessScore = extractHappinessScore(analysis);  // Custom function to extract score
      const stressScore = extractStressScore(analysis);        // Custom function to extract score

      // Return the mood analysis and scores
      res.json({ 
        mood_analysis: analysis, 
        happiness_score: happinessScore, 
        stress_score: stressScore
      });

    } catch (error) {
      res.status(500).json({ error: 'AI request failed.' });
    }
  } else if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://diary-ai-0.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end(); // No content for OPTIONS method
  } else {
    // Method not allowed for anything other than POST or OPTIONS
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Helper functions to extract happiness and stress scores from the AI response
function extractHappinessScore(analysis) {
  // Extracts happiness score from the analysis (you may adjust this regex to match the actual AI response format)
  const match = analysis.match(/Mutluluk Skoru: (\d+\/10)/);
  return match ? parseInt(match[1].split('/')[0]) : null;
}

function extractStressScore(analysis) {
  // Extracts stress score from the analysis (similar to happiness score extraction)
  const match = analysis.match(/Stres Skoru: (\d+\/10)/);
  return match ? parseInt(match[1].split('/')[0]) : null;
}

