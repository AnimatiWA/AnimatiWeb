import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { PurchaseItem } from '../../models/purchase-item';
import { environment } from '../../environments/environment';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseHistoryService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  getPurchaseHistory(): Observable<PurchaseItem[]> {
    const headers = this.loginService.userTokenHeader;
    return this.http.get<PurchaseItem[]>(
      environment.API_END_POINT + environment.METHODS.PURCHASE_HISTORY,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error al obtener historial de compras:', error);
        return throwError(() => new Error('Error al cargar el historial de compras. Por favor, intente más tarde.'));
      })
    );
  }
}
