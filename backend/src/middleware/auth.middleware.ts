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
    const token = req.cookies['auth_token'];

    if(!token){
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try{
        const verified = jwt.verify(token, JWT_SECRET) as UserPayload;

        (req as AuthRequest).user = verified;
        next();
    } catch (error){
        res.clearCookie('auth_token');
        return res.status(403).json({ message: 'Invalid Token'});
    }
}

