import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});