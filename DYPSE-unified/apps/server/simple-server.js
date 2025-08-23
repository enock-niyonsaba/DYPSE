const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.send('DYPSE API IS RUNNING - Simple Server');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DYPSE Simple Server is running' });
});

// Test API route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test successful', 
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'DYPSE Simple Server'
  });
});

// Basic auth routes (without database)
app.post('/api/auth/register', (req, res) => {
  res.status(501).json({ 
    message: 'Registration endpoint not implemented in simple server',
    status: 'not_implemented'
  });
});

app.post('/api/auth/login', (req, res) => {
  res.status(501).json({ 
    message: 'Login endpoint not implemented in simple server',
    status: 'not_implemented'
  });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 DYPSE Simple Server listening on port http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🧪 Test API: http://localhost:${port}/api/test`);
  console.log(`⚠️  This is a simplified server for testing - full features not available`);
});
