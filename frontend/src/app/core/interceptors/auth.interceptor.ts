import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserInfoStore } from '../stores/user-info.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(UserInfoStore);
  const token = store.jwtToken(); 

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};