import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { register, login, logout, getProfile } from './controllers/auth.controller';
import { authenticateToken } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// Routes
// Auth Public Route
app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/logout', logout);

// Auth Protected Route
app.get('/api/profile', authenticateToken, getProfile);

// Book Route
app.get('/api/books', (req: Request, res: Response) => {
    res.json({ message: 'Books endpoint' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})