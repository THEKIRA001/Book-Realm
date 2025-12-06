import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readData, writeData } from '../services/db.service';
import { User } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-key';


// Register User
export const register = async (req: Request, res: Response) => {
    try{
        const { username, email, password } = req.body;

        const users = await readData<User>('users');

        if(users.find(u => u.email === email)){
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        }

        users.push(newUser);
        await writeData('users', users);

        res.status(201).json({ message: 'User registered successfully' });
    } catch{
        res.status(500).json({ message: 'Error registering user' });
    }
}


// Login User
export const login = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        const users = await readData<User>('users');

        const user = users.find(u => u.email === email);
        if(!user){
            return res.status(400).json({ message: 'User Not Found' });
        } else if(!(await bcrypt.compare(password, user.password))){
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        const { password: _, ...userWithoutPassword } = user;
        res.json({ message: 'Login Successful', user: userWithoutPassword});
    } catch{
        res.status(500).json({ message: 'Error logging in' });
    }
}


// Logout User
export const logout = (req: Request, res: Response) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logout Successful' });
}


// Get User Profile
export const getProfile = async (req: Request, res: Response) => {
    try{
        const userId = (req as any).user.id;
        const users = await readData<User>('users');
        const user = users.find(u => u.id === userId);

        if(!user) return res.status(404).json({ message: 'User Not Found' });

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch{
        res.status(500).json({ message: 'Error fetching profile' });
    }
}