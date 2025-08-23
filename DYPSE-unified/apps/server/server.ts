import express from 'express';
import app from './app';
import { connectMongoDB } from './src/config/mongodb';
import authRouter from './src/routes/auth';
import dotenv from 'dotenv';

async function start() {
  try {
    // Load environment variables
    dotenv.config();
    
    // Connect to MongoDB
    await connectMongoDB();

    // Health check route
    app.get('/', (req, res) => {
      res.send('DYPSM API IS RUNNING');
    });

    // Test API route
    app.get('/api/test', (req, res) => {
      res.json({ message: 'API test successful', status: 'ok' });
    });

    // Mount auth routes
    app.use('/api/auth', authRouter);
    console.log('Auth routes are mounted at /api/auth');

    // Start server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server listening on port http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
