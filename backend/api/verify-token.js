import jwt from 'jsonwebtoken';
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
    const { token } = req.body;

    jwt.verify(token, "12ksdfm230r4r9k3049k2w4prf", (err, decoded) => {
      if (err) {
        return res.status(403).send("Geçersiz token.");
      }
      res.status(200).send({ userId: decoded.userId });
    });
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
