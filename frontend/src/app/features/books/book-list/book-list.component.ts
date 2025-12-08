import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BooksStore } from '../../../core/stores/books.store';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookListComponent {
  readonly store = inject(BooksStore);

  currentPage = signal(1);
  pageSize = 8;
  totalPages = computed(() => Math.ceil(this.store.allBooks().length / this.pageSize));
  paginatedBooks = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.store.allBooks().slice(startIndex, endIndex);
  });

  ngOnInit(){
    this.store.loadBooks();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      window.scrollTo(0, 0);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      window.scrollTo(0, 0);
    }
  }
}
