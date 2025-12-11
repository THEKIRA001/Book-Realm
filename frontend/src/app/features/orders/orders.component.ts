import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrdersStore } from '../../core/stores/orders.store';
import { Order } from '../../core/models/order.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
})
export class OrdersComponent {
  private ordersStore = inject(OrdersStore);
  private datePipe = inject(DatePipe);

  orders = this.ordersStore.allOrders;
  loading = this.ordersStore.loading;
  error = this.ordersStore.error;

  expanded = signal<Record<string, boolean>>({});

  ngOnInit(): void {
    this.ordersStore.loadOrders();
  }

  toggleExpand(id: string) {
    const current = { ...this.expanded() };
    current[id] = !current[id];
    this.expanded.set(current);
  }

  formatDate(iso?: string) {
    if (!iso) return '';
    return this.datePipe.transform(iso, 'medium') ?? iso;
  }

  orderTotal(order: Order) {
    const items = order.items ?? [];
    return items.reduce((sum: number, it: any) => {
      const price = (it.priceAtPurchase ?? it.price) ?? 0;
      const qty = it.quantity ?? 0;
      return sum + price * qty;
    }, 0);
  }

  shortId(id: string): string {
    if (!id) return '';
    return id.slice(0, 16).toUpperCase();
  }
}
