import { Router, Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = Router();

// Simple, high-performance request body validation middleware
const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: 'Name, email, and password are required fields.' });
    return;
  }
  
  if (password.length < 6) {
    res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    return;
  }

  if (role && role !== 'Admin' && role !== 'Sales User') {
    res.status(400).json({ success: false, message: 'Role must be either Admin or Sales User.' });
    return;
  }

  next();
};

router.post('/register', validateRegistration, registerUser);
router.post('/login', loginUser);

export default router;