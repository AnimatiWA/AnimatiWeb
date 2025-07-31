import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../auth/login.service';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { EstadoPago } from '../../interface/estadoPago';

@Injectable({
  providedIn: 'root',
})
export class MercadopagoService {
  constructor(private http: HttpClient, private loginService: LoginService) {}

  consultarEstadoPago(pedidoId: number) {
    const headers = this.loginService.userTokenHeader;

    return this.http.get<EstadoPago>(
      environment.API_END_POINT +
        environment.METHODS.GET_PURCHASE_STATUS +
        '?pedido_id=' +
        pedidoId,
      { headers }
    );
  }
}
