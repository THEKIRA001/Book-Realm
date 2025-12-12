import { patchState, signalStore, withMethods, withState, withHooks } from "@ngrx/signals";
import { LoginRequest, User } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { CartStore } from "./cart.store";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Math.floor(Date.now() / 1000) >= payload.exp;
  } catch (e) {
    return true;
  }
}

export interface UserInfoState {
    user: User | null;
    jwtToken: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserInfoState = {
    user: null,
    jwtToken: null,
    loading: false,
    error: null
}

export const UserInfoStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withMethods((store, authService = inject(AuthService), router = inject(Router), cartStore = inject(CartStore)) => ({

        // register
        register(userData: any) {
            patchState(store, { loading: true, error: null });

            authService.register(userData).subscribe({
                next: () => {
                    patchState(store, { loading: false });
                    router.navigate(['/login']);
                },
                error: (err) => {
                    console.error(err);
                    cartStore.showToast(err.error?.message || 'Registration failed');
                }
            })
        },

        // login
        login(credentials: LoginRequest) {
            patchState(store, { loading: true, error: null });

            authService.login(credentials).subscribe({
                next: (response: any) => {
                    sessionStorage.setItem('token', response.token);
                    sessionStorage.setItem('user', JSON.stringify(response.user));

                    patchState(store, { 
                        user: response.user, 
                        jwtToken: response.token, 
                        loading: false 
                    });
                    
                    router.navigate(['/books']);
                },
                error: (err) => {
                    console.error('Login Failed', err);
                    patchState(store, { loading: false, error: 'Invalid Email or Password' });
                }
            })
        },

        // show profile
        loadProfile() {
            patchState(store, { loading: true });
            authService.getProfile().subscribe({
                next: (user) => patchState(store, { user, loading: false }),
                error: () => patchState(store, { user: null, loading: false })
            })
        },

        // logout
        logout() {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            patchState(store, { user: null, jwtToken: null });
            router.navigate(['/login']);
        }
    })),

    withHooks({
        onInit(store) {
            const storedUser = sessionStorage.getItem('user');
            const storedToken = sessionStorage.getItem('token');

            if (storedUser && storedToken) {
                if (isTokenExpired(storedToken)) {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                    store.logout();
                } else {
                    patchState(store, {
                        user: JSON.parse(storedUser),
                        jwtToken: storedToken
                    });
                }
            }
        }
    })
);