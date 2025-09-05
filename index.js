const express = require('express');
const router = express.Router();
require('dotenv').config();
const connectDB = require("./config/db");
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;

// Import routes
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

// CORS configuration - extended for deployment
const corsOptions = {
  origin: [
    'https://soudia-tailors-client.vercel.app' 
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Connect to database
connectDB();

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// Health check route - serve JSON for API compatibility
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Soudia Tailors API is running...',
    timestamp: new Date().toISOString()
  });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler - return JSON for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Error handling middleware
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`App Server is running on port ${PORT}`);
});