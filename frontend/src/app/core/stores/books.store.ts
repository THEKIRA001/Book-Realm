import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { addEntity, setAllEntities, withEntities } from "@ngrx/signals/entities";
import { Book } from "../models/book.model";
import { computed, inject } from "@angular/core";
import { BooksService } from "../services/books.service";

export interface BooksState {
    loading: boolean;
    error: string | null;
}

export const BooksStore = signalStore(
    {providedIn: 'root'},
    withEntities<Book>(),
    withState<BooksState>({
        loading: false,
        error: null
    }),
    withComputed(({ entities }) => ({
        allBooks: computed(() => entities()),
        totalBooks: computed(() => entities().length),
        availableBooks: computed(() => entities().filter(b => b.quantity > 0))
    })),
    withMethods((store, booksService = inject(BooksService)) => ({
        loadBooks() {
            patchState(store, { loading: true, error: null });

            booksService.getBooks().subscribe({
                next: (books) => {
                    patchState(store, setAllEntities(books), {loading: false});
                },
                error: (err) => {
                    console.log(err);
                    patchState(store, { loading: false, error: 'Failed to load books' });
                }
            })
        },
        loadBookById(id: string) {
            patchState(store, {loading: true, error: null});

            booksService.getBookById(id).subscribe({
                next: (book) => {
                    patchState(store, addEntity(book), {loading: false});
                }, error: (err) => {
                    console.log(err);
                    patchState(store, {loading: false, error: 'Could not load book Details'});
                }
            });
        }
    }))
);