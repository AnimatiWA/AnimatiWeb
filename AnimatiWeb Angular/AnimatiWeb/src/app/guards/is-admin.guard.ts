import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { LoginService } from '../services/auth/login.service';
import { map } from 'rxjs';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService)
  const allowedRoles = route.data?.['is_staff'];
  
  loginService.userData.pipe(
    
  )
  return true
};
