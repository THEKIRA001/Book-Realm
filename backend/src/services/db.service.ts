import fs from 'fs/promises';
import path from 'path';

const userFilePath = path.join(__dirname, '../../data/users.json');
const booksFilePath = path.join(__dirname, '../../data/books.json');


// Check if Folder Exists
const ensureFileExists = async (filePath : string, defaultContent: any[]) => {
    try{
        await fs.access(filePath);
    } catch {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
    }
}  


// Read Data
export const readData = async <T>(type : 'users' | 'books'): Promise<T[]> => {
    const filePath = type === 'users' ? userFilePath : booksFilePath;
    await ensureFileExists(filePath, []);

    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}


// Write Data
export const writeData = async <T>(type : 'users' | 'books', data: T[]): Promise<void> => {
    const filePath = type === 'users' ? userFilePath : booksFilePath;
    await ensureFileExists(filePath, []);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}