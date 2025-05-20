import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../../interface/usuario';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  registrarse(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(environment.API_END_POINT + environment.METHODS.REGISTER, usuario);
  }
}
