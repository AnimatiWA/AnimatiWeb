import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import  {  Observable, throwError, catchError, BehaviorSubject , tap, map} from 'rxjs';
import { User } from './user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> =new BehaviorSubject<String>("");
  
  constructor(private http: HttpClient) { 
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null);
    this.currentUserData=new BehaviorSubject<String>(sessionStorage.getItem("token") || "");
  }

  login(credentials:LoginRequest):Observable<any>{
    return this.http.post<any>(environment.urlApi + "login",credentials).pipe(
      tap( (userData) => {
        
        sessionStorage.setItem("token", userData.token);
        this.currentUserData.next(userData.token);
        this.currentUserLoginOn.next(true);
      }),
      map((userData)=> userData.token),
      catchError(this.handleError)
    );
  }
  

  logout():void{
    
    sessionStorage.removeItem('token');
    this.currentUserLoginOn.next(false);
  }

  private handleError(error:HttpErrorResponse){
    if(error.status===0){
      console.error('Se ha producio un error ', error.error);
    }
    else{
      console.error('Backend retornó el código de estado ', error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }

  get userData():Observable<String>{
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean>{
    return this.currentUserLoginOn.asObservable();
  }

  get userToken():String{
    return this.currentUserData.value;
  }

  get userTokenHeader(): HttpHeaders{

    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({

        'Authorization': `Bearer ${token}`
    });

    return headers
  }

}