import fs from 'fs/promises';
import path from 'path';

const userFilePath = path.join(__dirname, '../../data/users.json');
const booksFilePath = path.join(__dirname, '../../data/books.json');
const ordersFilePath = path.join(__dirname, '../../data/orders.json');

type DataType = 'users' | 'books' | 'orders';


// Check if Folder Exists
const ensureFileExists = async (filePath : string, defaultContent: any[]) => {
    try{
        await fs.access(filePath);
    } catch {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
    }
}  

const getFilePath = (type: DataType): string => {
  switch (type) {
    case 'users':
      return userFilePath;
    case 'books':
      return booksFilePath;
    case 'orders':
      return ordersFilePath;
  }
};


// Read Data
export const readData = async <T>(type : DataType): Promise<T[]> => {
    const filePath = getFilePath(type);
    await ensureFileExists(filePath, []);
    
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}


// Write Data
export const writeData = async <T>(type : DataType, data: T[]): Promise<void> => {
    const filePath = getFilePath(type);
    await ensureFileExists(filePath, []);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}