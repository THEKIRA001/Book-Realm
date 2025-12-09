import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookDetailsComponent } from './features/books/book-details/book-details.component';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path:'', redirectTo: 'books', pathMatch: 'full'},
    
    { path: 'books', component: BookListComponent },
    { path: 'books/:id', component: BookDetailsComponent },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'books' }
];
