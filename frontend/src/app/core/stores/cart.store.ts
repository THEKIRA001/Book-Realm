import { computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, withHooks, patchState } from '@ngrx/signals';
import { CartItem } from '../models/cart.model';
import { Book } from '../models/book.model';

const CART_STORAGE_KEY = 'book_realm_cart';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>(initialState),

  withComputed((store) => ({
    cartItemsDetailed: computed(() => store.items()),
    totalItems: computed(() =>
      store.items().reduce((sum, item) => sum + item.quantity, 0)
    ),
    totalPrice: computed(() =>
      store.items().reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
      )
    ),
  })),

  withMethods((store) => {
    const persist = () => {
      const current = store.items();
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(current)
      );
    };

    const loadFromStorage = () => {
      try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[];
          patchState(store, { items: parsed });
        }
      } catch {
        patchState(store, { items: [] });
      }
    };

    return {
      loadFromStorage,

      addToCart(book: Book) {
        const current = store.items();
        const existing = current.find(i => i.book.id === book.id);

        let updated: CartItem[];
        if (existing) {
          updated = current.map(i => i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
          updated = [...current, { book, quantity: 1 }];
        }

        patchState(store, { items: updated });
        persist();
      },

      removeFromCart(bookId: string) {
        const updated = store.items().filter(i => i.book.id !== bookId);
        patchState(store, { items: updated });
        persist();
      },

      updateQuantity(bookId: string, quantity: number) {
        if (quantity <= 0) {
          const updated = store.items().filter(
            i => i.book.id !== bookId
          );
          patchState(store, { items: updated });
          persist();
          return;
        }

        const updated = store.items().map(i => i.book.id === bookId ? { ...i, quantity } : i );
        patchState(store, { items: updated });
        persist();
      },

      clearCart() {
        patchState(store, { items: [] });
        persist();
      },

      getCreateOrderItems() {
        return store.items().map(i => ({
          bookId: i.book.id,
          title: i.book.title,
          quantity: i.quantity,
        }));
      },
    };
  }),

  withHooks({
    onInit(store) {
      store.loadFromStorage();
    },
  })
);
