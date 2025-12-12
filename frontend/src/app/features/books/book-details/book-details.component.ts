import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BooksStore } from '../../../core/stores/books.store';
import { CartStore } from '../../../core/stores/cart.store';
import { Book } from '../../../core/models/book.model';
import { UserInfoStore } from '../../../core/stores/user-info.store';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailsComponent implements OnInit{
  private route = inject(ActivatedRoute);
  readonly store = inject(BooksStore);
  private cartStore = inject(CartStore);
  private router = inject(Router);
  private userStore = inject(UserInfoStore);

  selectedId = signal<string | null>(null);

  selectedBook = computed(() => {
    const id = this.selectedId();
    const map = this.store.entityMap();
    return id ? map[id] : undefined;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.selectedId.set(id);

    if(id) {
      const bookInMemory = this.store.entityMap()[id];
      if(!bookInMemory){
        this.store.loadBookById(id);
      }
    }
  }

  onAddToCart(book: Book){
    this.cartStore.addToCart(book);
  }

  onBuyNow(book: Book){
    if (!this.userStore.jwtToken()) {
        this.cartStore.showToast('You need to login to proceed to Checkout');
        this.router.navigate(['/login']);
        return;
    }
    sessionStorage.setItem('allowCheckout', '1');
    this.cartStore.addToCart(book);
    this.router.navigate(['/checkout']);
  }
}
