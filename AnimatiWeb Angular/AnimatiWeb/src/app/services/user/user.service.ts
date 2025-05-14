import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private getToken(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || '';
  }

  getPerfilUsuario(): Observable<User> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http
      .get<User>(`${environment.urlApi}perfil-usuario`, { headers })
      .pipe(catchError(this.handleError));
  }

  updateUser(userRequest: User): Observable<any> {
    return this.http
      .put(environment.urlApi + 'user', userRequest)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error:', error.error);
    } else {
      console.error(
        `Backend retornó el código de estado ${error.status}:`,
        error.error
      );
    }
    return throwError(() => new Error('Algo falló, intente nuevamente'));
  }
}
