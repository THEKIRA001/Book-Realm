import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-key';

interface UserPayload {
    id: string;
    email: string;
} 

export interface AuthRequest extends Request {
    user?: UserPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user = verified; 
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
}

