import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import booksRoutes from './routes/books.routes';
import authRoutes from './routes/auth.routes';

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
// Auth Route
app.use('/api', authRoutes);

// Book Routes
app.use('/api/books', booksRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})