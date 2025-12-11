import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserInfoStore } from '../../core/stores/user-info.store';
import { CartStore } from '../../core/stores/cart.store';
import { OrdersStore } from '../../core/stores/orders.store';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
  private userStore = inject(UserInfoStore);
  private cartStore = inject(CartStore);
  private ordersStore = inject(OrdersStore);
  private router = inject(Router);

  user = this.userStore.user;
  cartItemDetailed = this.cartStore.cartItemsDetailed;
  totalPrice = this.cartStore.totalPrice;

  loading = this.ordersStore.loading;
  error = this.ordersStore.error;

  purchaseSuccess = signal(false);

  ngOnInit(): void {
    const allowed = sessionStorage.getItem('allowCheckout') === '1';

    sessionStorage.removeItem('allowCheckout');

    if (!allowed) {
      if (!this.cartItemDetailed().length) {
        this.router.navigate(['/cart']);
        return;
      }
      this.router.navigate(['/cart']);
      return;
    }
  }

  async onBuyNow() {
    if (!this.cartItemDetailed().length) return;

    const created = await this.ordersStore.placeOrderFromCart();

    if (created) {
      this.purchaseSuccess.set(true);
    }
  }
}
