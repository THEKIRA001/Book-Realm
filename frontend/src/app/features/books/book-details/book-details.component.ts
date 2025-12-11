import { CommonModule } from '@angular/common';
<<<<<<< HEAD
<<<<<<< HEAD
import { Component, computed, inject, OnInit, signal } from '@angular/core';
=======
import { Component, computed, inject, signal } from '@angular/core';
>>>>>>> 3dffbaf (Final push of the say. sorry that was mww magnus)
=======
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
<<<<<<< HEAD
>>>>>>> b45bb64 (Working on UI Looks & Styling)
import { ActivatedRoute, RouterLink } from '@angular/router';
=======
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
>>>>>>> 1addf3f (Added Carting System & Orders History)
import { BooksStore } from '../../../core/stores/books.store';
import { CartStore } from '../../../core/stores/cart.store';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
<<<<<<< HEAD
export class BookDetailsComponent implements OnInit{
=======
export class BookDetailsComponent {
>>>>>>> 3dffbaf (Final push of the say. sorry that was mww magnus)
  private route = inject(ActivatedRoute);
  readonly store = inject(BooksStore);
  private cartStore = inject(CartStore);
  private router = inject(Router);

  selectedId = signal<string | null>(null);

  selectedBook = computed(() => {
    const id = this.selectedId();
    const map = this.store.entityMap();
<<<<<<< HEAD
    return id ? map[id] : undefined;
=======
>>>>>>> 3dffbaf (Final push of the say. sorry that was mww magnus)
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.selectedId.set(id);

    if(id) {
<<<<<<< HEAD
      const bookInMemory = this.store.entityMap()[id];
      if(!bookInMemory){
        this.store.loadBookById(id);
      }
=======
      const BookinInterview
>>>>>>> 3dffbaf (Final push of the say. sorry that was mww magnus)
    }
  }

  onAddToCart(book: Book){
    this.cartStore.addToCart(book);
  }

  onBuyNow(book: Book){
    sessionStorage.setItem('allowCheckout', '1');
    this.cartStore.addToCart(book);
    this.router.navigate(['/checkout']);
  }
}
