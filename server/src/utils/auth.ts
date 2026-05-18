import jwt from 'jsonwebtoken';

export const generateToken = (userId: any, role: string): string => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'fallback_secret_for_development',
    { expiresIn: '1d' }
  );
};