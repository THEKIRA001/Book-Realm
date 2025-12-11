import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../services/db.service';
import { Order, OrderItem, CreateOrderDto } from '../models/order.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { Book } from '../models/book.model';


// GET orders
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;

    const allOrders = await readData<Order>('orders');
    const userOrders = allOrders.filter(order => order.userId === userId);

    res.json(userOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// create order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;
    const body = req.body as CreateOrderDto;

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const books = await readData<Book>('books');

    const orderItems: OrderItem[] = [];
    let totalPrice = 0;

    for (const item of body.items) {
      const { bookId, title, quantity } = item;

      if (!bookId || !title || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid cart item' });
      }

      const book = books.find(b => b.id === bookId);
      if (!book) {
        return res.status(400).json({ message: `Book not found: ${bookId}` });
      }

      const price = book.price;

      const orderItem: OrderItem = {
        bookId,
        title,
        quantity,
        price
      };

      orderItems.push(orderItem);
      totalPrice += price * quantity;
    }

    const newOrder: Order = {
      id: uuidv4(),
      userId,
      items: orderItems,
      totalPrice,
      placedAt: new Date().toISOString()
    };

    const existingOrders = await readData<Order>('orders');
    existingOrders.push(newOrder);
    await writeData<Order>('orders', existingOrders);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};
