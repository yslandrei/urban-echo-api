import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { login, register } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Example of a protected route
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: "mama" });
});


export default router;