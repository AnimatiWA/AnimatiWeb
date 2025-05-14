import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../../models/user';
import { environment } from '../../environments/environment';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private loginService: LoginService) {}

  getPerfilUsuario(): Observable<User> {
    const headers = this.loginService.userTokenHeader;
    return this.http
      .get<User>(environment.API_END_POINT + environment.METHODS.USER_PROFILE, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  updateUser(userRequest: User): Observable<any> {
    const headers = this.loginService.userTokenHeader;
    return this.http
      .put(
        environment.API_END_POINT + environment.METHODS.USER_PROFILE,
        userRequest,
        { headers }
      )
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
