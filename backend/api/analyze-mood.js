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

      // OpenAI API request for mood analysis, happiness & stress score
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Sen bir ruh hali analizcisinsin.' },
          { 
            role: "user", 
            content: `Aşağıdaki günlük girdisini analiz et:
            - Bu girdinin ruh hali nedir? Bir terapist gibi sade bir dil ile biraz ayrintili acikla ve tavsiyeler ver.Eğer anlamsız bir kelime veya anlamsız cumleler yazılmışsa analiz etme ve "Anladıysam arap olayım" yaz.
            - 10 üzerinden bir mutluluk skoru ver (0: çok mutsuz, 10: çok mutlu). Olumlu içerikler ve güzel şeyler üzerinden değerlendir.
            - 10 üzerinden bir stres skoru ver (0: hiç stresli değil, 10: çok stresli). Olumsuz şeyler ve stres verici düşünceler üzerinden değerlendir.
            - Son olarak, mümkünse analizin sonuna bir quote ekle. 

            Günlük: "${text}"
            
            Yanıtını sadece şu JSON formatında ver:
            {
              "mood_analysis": "<ruh hali açıklaması>",
              "happiness_score": <mutluluk skoru>,
              "stress_score": <stres skoru>,
              "quote": "<motivasyon sözü>"
            }`
          },
        ],
        response_format: "json",
      });
      
      console.log("ai response", response.choices[0].message.content)
      // Return the response JSON
      res.json(JSON.parse(response.choices[0].message.content));
    } catch (error) {
      console.error('AI request failed:', error);
      res.status(500).json({ error: 'AI request failed.' });
    }
  } else if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://diary-ai-0.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
