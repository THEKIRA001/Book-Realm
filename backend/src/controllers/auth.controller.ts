import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readData, writeData } from '../services/db.service';
import { User } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-key';

// Register User
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const users = await readData<User>('users') || [];

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            avatar: `https://ui-avatars.com/api/?name=${username}`
        }

        users.push(newUser);
        await writeData('users', users);

        res.status(201).json({ message: 'User registered successfully' });
    } catch {
        res.status(500).json({ message: 'Error registering user' });
    }
}


// Login User
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const users = await readData<User>('users');

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'User Not Found' });
        } else if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
            token: token
        });
    } catch {
        res.status(500).json({ message: 'Error logging in' });
    }
}


// Logout User
export const logout = (req: Request, res: Response) => {
    res.json({ message: 'Logout Successful' });
}


// Get User Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const users = await readData<User>('users');

        const user = users.find(u => u.id === req.user?.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}