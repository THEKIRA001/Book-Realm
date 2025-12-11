export interface OrderItem {
  bookId: string;
  title?: string;
  quantity: number;
  price?: number;
  priceAtPurchase?: number; 
}

export interface Order {
  id: string;
  userId: string;
  items?: OrderItem[];
  totalAmount?: number;
  placedAt?: string;
}

export interface CreateOrderItemDto {
  bookId: string;
  title: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
}
