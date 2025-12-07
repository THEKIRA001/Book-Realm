import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserInfoStore } from '../stores/user-info.store';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(UserInfoStore);
  const router = inject(Router);

  if (store.jwtToken()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};