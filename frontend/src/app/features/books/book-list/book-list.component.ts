import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  ngOnInit(){
    this.store.loadBooks();
  }
}
