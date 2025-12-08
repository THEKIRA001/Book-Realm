import { CommonModule } from '@angular/common';
<<<<<<< HEAD
<<<<<<< HEAD
import { Component, computed, inject, OnInit, signal } from '@angular/core';
=======
import { Component, computed, inject, signal } from '@angular/core';
>>>>>>> 3dffbaf (Final push of the say. sorry that was mww magnus)
=======
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
>>>>>>> b45bb64 (Working on UI Looks & Styling)
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BooksStore } from '../../../core/stores/books.store';

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
}
