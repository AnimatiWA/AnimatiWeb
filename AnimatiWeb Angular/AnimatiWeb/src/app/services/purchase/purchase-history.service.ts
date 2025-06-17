import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
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
      tap(compras => {
        console.log('Historial de compras cargado:', compras);
      }),
      catchError(error => {
        console.error('Error al obtener historial de compras:', error);
        return throwError(() => new Error('Error al cargar el historial de compras. Por favor, intente más tarde.'));
      })
    );
  }
  
  registrarCompra(datos: { total: number, items: number, metodoPago?: string }): Observable<PurchaseItem> {
    const headers = this.loginService.userTokenHeader;
    
    const compra = {
      Precio: datos.total,
      Cantidad: datos.items,
      Fecha: new Date().toISOString(),
      Confirmado: true,
      MetodoPago: datos.metodoPago || 'No especificado'
    };
    
    return this.http.post<PurchaseItem>(
      environment.API_END_POINT + environment.METHODS.REGISTER_PURCHASE,
      compra,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error al registrar la compra:', error);
        return throwError(() => new Error('No se pudo registrar la compra en el historial. Por favor, verifique más tarde.'));
      })
    );
  }
}
