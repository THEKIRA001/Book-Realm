import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { OrdersService } from '../services/orders.service';
import { Order } from '../models/order.model';
import { CartStore } from './cart.store';
import { firstValueFrom } from 'rxjs';

interface OrdersState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    loading: false,
    error: null,
};

export const OrdersStore = signalStore(
    { providedIn: 'root' },

    withState<OrdersState>(initialState),

    withComputed((store) => ({
        allOrders: computed(() => store.orders()),
        hasOrders: computed(() => store.orders().length > 0),
    })),

    withMethods(
        (
            store,
            ordersService = inject(OrdersService),
            cartStore = inject(CartStore)
        ) => ({
            async loadOrders() {
                patchState(store, { loading: true, error: null });

                try {
                    const orders = await firstValueFrom(ordersService.getOrders());
                    patchState(store, { orders: orders ?? [] });
                } catch (err) {
                    console.error('Failed to load orders', err);
                    patchState(store, { error: 'Failed to load orders' });
                } finally {
                    patchState(store, { loading: false });
                }
            },

            async placeOrderFromCart(): Promise<Order | null> {
                const rawItems = cartStore.getCreateOrderItems();

                if (!Array.isArray(rawItems) || rawItems.length === 0) {
                    patchState(store, { error: 'Cart is empty' });
                    return null;
                }

                patchState(store, { loading: true, error: null });

                const items = rawItems.map((it: any, idx: number) => {
                    const bookId = it?.bookId ?? it?.id ?? null;
                    const title = it?.title ?? null;
                    const qty = it?.quantity ?? it?.qty ?? it?.qtyOrdered ?? null;

                    return {
                        bookId: bookId?.toString(),
                        title: title.toString(),
                        quantity: Number(qty)
                    };
                });

                for (let i = 0; i < items.length; i++) {
                    const it = items[i];
                    if (!it.bookId || Number.isNaN(it.quantity) || it.quantity <= 0 || !Number.isInteger(it.quantity)) {
                        console.error('Invalid order item at index', i, rawItems[i], 'normalized->', it);
                        patchState(store, { error: `Invalid item in cart at index ${i}` });
                        patchState(store, { loading: false });
                        return null;
                    }
                }

                try {
                    const created = await firstValueFrom(
                        ordersService.createOrder({ items })
                    );

                    if (created) {
                        const current = store.orders();
                        patchState(store, { orders: [...current, created] });
                        cartStore.clearCart();
                        patchState(store, { loading: false });
                        return created;
                    } else {
                        patchState(store, { error: 'Failed to create order' });
                        patchState(store, { loading: false });
                        return null;
                    }
                } catch (err) {
                    console.error('Failed to place order', err);
                    patchState(store, { error: 'Failed to place order' });
                    patchState(store, { loading: false });
                    return null;
                }
            },
        })
    )
);
