import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Ventas } from '../../interface/ventaslista';
import { LoginService } from '../auth/login.service';


@Injectable({
  providedIn: 'root',
})
export class SalesService {
  

  constructor(private http: HttpClient, private auth: LoginService) {}

  getVentas(): Observable<Ventas> {
    const headers = this.auth.userTokenHeader;

    return this.http.get<Ventas>(
          environment.API_END_POINT + environment.METHODS.GET_ALL_SALES,
          { headers }
        );
  }
   
}

