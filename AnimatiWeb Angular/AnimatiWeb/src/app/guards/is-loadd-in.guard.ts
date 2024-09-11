import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoaddInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const localData= localStorage.getItem('is_staff')
  
  if (!localData){
    return false
  }else{
    
    return true;
    } 
    
};

