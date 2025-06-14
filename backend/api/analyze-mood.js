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
  await dbConnect();

  if (req.method === 'POST') {
    const { text } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).send('Token is required.');
    }

    try {
      const decoded = jwt.verify(token, "12ksdfm230r4r9k3049k2w4prf");

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a mood analyst.' },
          { 
            role: "user", 
            content: `What is the mood of this input? Provide a detailed explanation in simple language like a therapist, and offer suggestions on what can be done. If possible, add a quote at the end of the analysis. If there are any meaningless words or sentences, reply with "Anladıysam arap olayım". Also, give a happiness score and stress score for the journal, but first write the mood analysis, then "Happiness Score: score/10" on the next line, and "Stress Score: score/10" and the additional emotions with their respective scores (from 1 to 10). Respond only in the following format:
      
            - Mood Analysis: [mood description]
            - Happiness Score: [score between 1 and 10]
            - Stress Score: [score between 1 and 10]
            - Additional Emotions: [emotion: score, emotion2: score, ...]
            Here is the text: ${text}`
          },
        ],
      });  
      

      const analysis = response.choices[0].message.content;

      // Match for the happiness and stress scores
      const happinessScoreMatch = analysis.match(/Happiness Score: (\d+)/);
      const stressScoreMatch = analysis.match(/Stress Score: (\d+)/);
      const emotionsMatch = analysis.match(/Additional Emotions: (.+)/);
  
      const happinessScore = happinessScoreMatch ? parseInt(happinessScoreMatch[1]) : null;
      const stressScore = stressScoreMatch ? parseInt(stressScoreMatch[1]) : null;
      const additionalEmotions = emotionsMatch ? emotionsMatch[1].trim() : null;
  
      // Clean the analysis
      let cleanAnalysis = analysis.replace(/- Mood Analysis: /, '').trim();
      cleanAnalysis = cleanAnalysis.replace(/Happiness Score: \d+\/10/, '').replace(/Stress Score: \d+\/10/, '').replace(/Additional Emotions: .+/, '').trim();
  
      // Remove unnecessary bullet points and newlines
      cleanAnalysis = cleanAnalysis.replace(/-\s*/g, '').replace(/\n+/g, ' ').trim();
  
      // Return the cleaned mood analysis and separate scores
      res.json({ 
        mood_analysis: cleanAnalysis, 
        happiness_score: happinessScore, 
        stress_score: stressScore,
        additional_emotions: additionalEmotions
      });

    } catch (error) {
      res.status(500).json({ error: 'AI request failed.' });
    }
  } else if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://aidiary.online');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end(); // No content for OPTIONS method
  } else {
    // Method not allowed for anything other than POST or OPTIONS
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
