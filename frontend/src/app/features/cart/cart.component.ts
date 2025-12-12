import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartStore } from '../../core/stores/cart.store';
import { UserInfoStore } from '../../core/stores/user-info.store';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private cartStore = inject(CartStore);
  private router = inject(Router);
  private userStore = inject(UserInfoStore);

  cartItemsDetailed = this.cartStore.cartItemsDetailed;
  totalItems = this.cartStore.totalItems;
  totalPrice = this.cartStore.totalPrice;

  onRemove(bookId: string) {
    this.cartStore.removeFromCart(bookId);
  }

  onIncrease(bookId: string) {
    const items = this.cartItemsDetailed();
    const current = items.find(i => i.book?.id === bookId);
    const qty = current?.quantity ?? 0;
    this.cartStore.updateQuantity(bookId, qty + 1);
  }

  onDecrease(bookId: string) {
    const items = this.cartItemsDetailed();
    const current = items.find(i => i.book?.id === bookId);
    const qty = current?.quantity ?? 1;
    this.cartStore.updateQuantity(bookId, qty - 1);
  }

  onProceedToCheckout() {
    if (!this.userStore.jwtToken()) {
        this.cartStore.showToast('You need to login to proceed to Checkout');
        this.router.navigate(['/login']);
        return;
    }
    sessionStorage.setItem('allowCheckout', '1');
    this.router.navigate(['/checkout']);
  }
}
