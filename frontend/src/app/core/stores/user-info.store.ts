import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { LoginRequest, User } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export interface UserInfoState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserInfoState = {
    user: null,
    loading: false,
    error: null
}

export const UserInfoStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),

    withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({

        // login
        async login(credentials: LoginRequest){
            patchState(store, {loading: true, error: null});

            try{
                authService.login(credentials).subscribe({
                    next: (response) => {
                        patchState(store, {user: response.user, loading: false});
                        router.navigate(['/books']);
                    },
                    error: (err) => {
                        console.error('Login Failed', err);
                        patchState(store, {loading: false, error: 'Invalid Email or Password'});
                    }
                })
            } catch (e){
                patchState(store, { loading: false, error: 'Unexpected error' });
            }
        },

        // show profile
        loadProfile(){
            patchState(store, {loading: true});
            authService.getProfile().subscribe({
                next: (user) => patchState(store, {user, loading: false}),
                error: () => patchState(store, {user: null, loading: false})
            })
        },

        // logout
        logout(){
            authService.logout().subscribe({
                next:() => {
                    patchState(store, {user: null});
                    router.navigate(['/login']);
                }
            })
        }
    }))
);