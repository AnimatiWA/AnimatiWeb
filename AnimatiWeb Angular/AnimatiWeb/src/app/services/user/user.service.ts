import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../auth/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUser(id:number):Observable<User>{

    return this.http.get<User>(environment.urlApi+"usuarios/"+id).pipe(
      catchError(this.handleError)
    )
  }

  


  updateUser(userRequest:User):Observable<any>{

    return this.http.put(environment.urlApi+'user', userRequest).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error:HttpErrorResponse){
    if(error.status===0){
      console.error('se ha producido un error', error.error);
    }
    else{
      console.error('Backend retorno el codigo de estado', error.status, error.error);
    }
    return throwError(() => new Error('algo fallo, intente nuevamente'))
  }

}
