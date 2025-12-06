import {Request, Response} from 'express';
import { readData } from '../services/db.service';
import {Book} from '../models/book.model';

export const getAllBooks = async (req: Request, res: Response) => {
    try{
        const books = await readData<Book>('books');
        res.status(200).json(books);
    } catch(error){
        res.status(500).json({ message: 'Error fetching books' });
    }
}

export const getBookById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const books = await readData<Book>('books');
        const book = books.find(b => b.id === id);

        if(!book){
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch(error){
        res.status(500).json({ message: 'Error fetching book details' });
    }
}