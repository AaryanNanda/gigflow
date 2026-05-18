import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface to securely hold user details
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'Admin' | 'Sales User';
  };
}

// Middleware to protect routes against unauthenticated requests
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Check for token in the Authorization header (Format: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development') as any;

      // Attach decoded payload (id and role) to request object
      req.user = {
        id: decoded.id,
        role: decoded.role
      };

      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Middleware to restrict routes to specific roles (Role-Based Access Control)
export const authorize = (...allowedRoles: ('Admin' | 'Sales User')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to perform this action' });
      return;
    }
    next();
  };
};