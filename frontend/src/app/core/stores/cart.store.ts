import { computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, withHooks, patchState } from '@ngrx/signals';
import { CartItem } from '../models/cart.model';
import { Book } from '../models/book.model';

const CART_STORAGE_KEY = 'book_realm_cart';

interface CartState {
  items: CartItem[];
  uiError: string | null;
}

const initialState: CartState = {
  items: [],
  uiError: null,
};

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>(initialState),

  withComputed((store) => ({
    cartItemsDetailed: computed(() => store.items()),
    totalItems: computed(() => store.items().reduce((sum, item) => sum + item.quantity, 0)),
    totalPrice: computed(() => store.items().reduce((sum, item) => sum + item.book.price * item.quantity, 0)),
  })),

  withMethods((store) => {
    let timeoutId: any; 

    const showToast = (message: string) => {
      if (timeoutId) clearTimeout(timeoutId);
      patchState(store, { uiError: message });
      timeoutId = setTimeout(() => {
        patchState(store, { uiError: null });
      }, 3000);
    };

    const persist = () => {
      const current = store.items();
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(current));
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
      showToast, 

      addToCart(book: Book) {
        if (book.quantity <= 0) {
            showToast(`Sorry, "${book.title}" is out of stock!`);
            return;
        }

        const current = store.items();
        const existing = current.find(i => i.book.id === book.id);
        let updated: CartItem[];

        if (existing) {
          if (existing.quantity + 1 > book.quantity) {
             showToast(`Only ${book.quantity} copies of "${book.title}" available!`);
             return; 
          }
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
        const current = store.items();
        const item = current.find(i => i.book.id === bookId);
        
        if(!item) return;

        if (quantity > item.book.quantity) {
            showToast(`Cannot add more. Only ${item.book.quantity} in stock.`);
            return; 
        }

        if (quantity <= 0) {
          const updated = store.items().filter(i => i.book.id !== bookId);
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