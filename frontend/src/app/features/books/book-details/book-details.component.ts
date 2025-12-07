import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BooksStore } from '../../../core/stores/books.store';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit{
  private route = inject(ActivatedRoute);
  readonly store = inject(BooksStore);

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
}
