import { OpenAI } from 'openai';
import Cors from 'cors';

// Initialize OpenAI client
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

  if (req.method === 'POST') {
    const { messages } = req.body;

    try {
      // Format the incoming messages into the OpenAI API structure
      const formattedMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      // Call OpenAI API to generate response
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an empathetic emotional coach. Your primary goal is to understand the user's emotional state and stress level by asking thoughtful follow-up questions. 
            Start with warm, curious questions. Ask why they feel a certain way, what caused it, and how it affects their daily life. Do NOT give advice or analysis too early. 
            Once the user has shared 4 or more meaningful replies, provide a gentle report of their emotional state, potential stressors, and positive piece of advice. 
            Always keep a calm, caring, and non-judgmental tone. End analysis with a motivational quote if possible.`
          },
          ...formattedMessages,
        ],
      });

      // Send the AI-generated reply as the response
      res.json({ reply: response.choices[0].message.content });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch AI response" });
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
