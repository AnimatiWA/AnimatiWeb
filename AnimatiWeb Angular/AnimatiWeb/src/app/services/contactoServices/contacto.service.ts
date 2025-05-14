// src/app/services/contacto.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Contacto {
  nombre: string;
  email: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(private http: HttpClient) {}

  getToken(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  enviarMensaje(contacto: Contacto): Observable<any> {
    const headers = this.getToken();
    return this.http.post(
      environment.API_END_POINT + environment.METHODS.CREATE_CONTACTO,
      contacto,
      { headers }
    );
  }
}
