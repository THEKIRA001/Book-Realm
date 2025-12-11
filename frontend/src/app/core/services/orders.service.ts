import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CreateOrderDto, Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  getOrders() {
    return this.http.get<Order[]>(this.apiUrl);
  }

  createOrder(dto: CreateOrderDto) {
    console.log('OrdersService.createOrder -> dto:', dto);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Order>(this.apiUrl, dto, { headers });
  }
}
