import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartStore } from '../../core/stores/cart.store';

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
    sessionStorage.setItem('allowCheckout', '1');
    this.router.navigate(['/checkout']);
  }
}
