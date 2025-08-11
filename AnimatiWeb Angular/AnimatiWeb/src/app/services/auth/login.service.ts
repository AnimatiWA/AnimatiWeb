import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import {
  Observable,
  throwError,
  catchError,
  BehaviorSubject,
  tap,
  map,
} from 'rxjs';
import { User } from '../../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>('');
  currentUserIsAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private http: HttpClient) {
    this.currentUserLoginOn = new BehaviorSubject<boolean>(
      sessionStorage.getItem('token') != null
    );
    this.currentUserData = new BehaviorSubject<String>(
      sessionStorage.getItem('token') || ''
    );
    
    // Verificar si el usuario actual es admin al inicializar
    this.currentUserIsAdmin = new BehaviorSubject<boolean>(
      this.checkStoredAdminStatus()
    );
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'login', credentials).pipe(
      tap((userData) => {
        // DEBUGGING: Ver qué devuelve exactamente la API
        console.log('=== RESPUESTA COMPLETA DE LA API ===');
        console.log('userData:', userData);
        console.log('userData.user:', userData.user);
        console.log('userData.role:', userData.role);
        console.log('userData.tipo:', userData.tipo);
        console.log('===================================');

        // Guardar token como antes
        sessionStorage.setItem('token', userData.token);
        this.currentUserData.next(userData.token);
        this.currentUserLoginOn.next(true);

        // Guardar información del usuario y verificar rol de admin
        this.saveUserData(userData);
        
        // Actualizar estado de admin
        const isAdmin = this.extractAdminRole(userData);
        this.currentUserIsAdmin.next(isAdmin);
        
        console.log('=== RESULTADO FINAL ===');
        console.log('Usuario logueado:', {
          token: userData.token,
          isAdmin: isAdmin,
          userRole: sessionStorage.getItem('userRole'),
          userType: sessionStorage.getItem('userType')
        });
        console.log('=======================');
      }),
      map((userData) => userData.token),
      catchError(this.handleError)
    );
  }

  logout(): void {
    // Limpiar todo el almacenamiento de sesión
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userName');
    
    // Resetear BehaviorSubjects
    this.currentUserLoginOn.next(false);
    this.currentUserData.next('');
    this.currentUserIsAdmin.next(false);
  }

  /**
   * Guardar datos del usuario en sessionStorage
   */
  private saveUserData(userData: any): void {
    try {
      // Guardar datos completos del usuario
      if (userData.user) {
        sessionStorage.setItem('userData', JSON.stringify(userData.user));
        
        // Guardar campos específicos si existen
        if (userData.user.email) {
          sessionStorage.setItem('userEmail', userData.user.email);
        }
        if (userData.user.nombre || userData.user.name) {
          sessionStorage.setItem('userName', userData.user.nombre || userData.user.name);
        }
      }
    } catch (error) {
      console.error('Error al guardar datos del usuario:', error);
    }
  }

  /**
   * Extraer y guardar el rol de admin desde la respuesta del login
   */
  private extractAdminRole(userData: any): boolean {
    let isAdmin = false;

    try {
      // Verificar diferentes estructuras de respuesta posibles
      
      // Caso 1: El rol viene directamente en userData
      if (userData.role) {
        sessionStorage.setItem('userRole', userData.role);
        isAdmin = this.isAdminRole(userData.role);
      }
      
      // Caso 2: El rol viene en userData.user
      if (userData.user && userData.user.role) {
        sessionStorage.setItem('userRole', userData.user.role);
        isAdmin = this.isAdminRole(userData.user.role);
      }
      
      // Caso 3: El tipo viene en userData.user.tipo
      if (userData.user && userData.user.tipo) {
        sessionStorage.setItem('userType', userData.user.tipo);
        isAdmin = this.isAdminRole(userData.user.tipo);
      }
      
      // Caso 4: Decodificar token JWT para obtener información (TU CASO)
      if (userData.token && !isAdmin) {
        const decodedToken = this.decodeJWT(userData.token);
        console.log('Token decodificado:', decodedToken);
        
        if (decodedToken) {
          // Guardar user_id del token
          if (decodedToken.user_id) {
            sessionStorage.setItem('userId', decodedToken.user_id.toString());
            
            // Lista de IDs de usuarios administradores
            // AJUSTA ESTOS IDs SEGÚN TUS ADMINISTRADORES
            const adminUserIds = [1, 2]; // IDs de los usuarios admin
            isAdmin = adminUserIds.includes(decodedToken.user_id);
            
            if (isAdmin) {
              sessionStorage.setItem('userRole', 'admin');
              console.log('Admin detectado por user_id:', decodedToken.user_id);
            }
          }
          
          // Si el token tiene rol directamente
          if (decodedToken.role) {
            sessionStorage.setItem('userRole', decodedToken.role);
            isAdmin = this.isAdminRole(decodedToken.role);
          }
        }
      }

      // Caso 5: Verificar por email de admin (fallback)
      if (!isAdmin && userData.user && userData.user.email) {
        // Lista de emails de administradores (AJUSTA ESTOS EMAILS)
        const adminEmails = [
          'admin@animati.com', 
          'administrador@animati.com',
          'tu-email-admin@gmail.com', // Agrega tu email aquí
          'admin@example.com'
        ];
        isAdmin = adminEmails.includes(userData.user.email.toLowerCase());
        if (isAdmin) {
          sessionStorage.setItem('userRole', 'admin');
          console.log('Admin detectado por email:', userData.user.email);
        }
      }

    } catch (error) {
      console.error('Error al extraer rol de admin:', error);
    }

    return isAdmin;
  }

  /**
   * Verificar si un rol corresponde a administrador
   */
  private isAdminRole(role: string): boolean {
    if (!role) return false;
    
    const adminRoles = ['admin', 'ADMIN', 'administrador', 'ADMINISTRADOR', 'Admin'];
    return adminRoles.includes(role);
  }

  /**
   * Decodificar token JWT
   */
  private decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error al decodificar JWT:', error);
      return null;
    }
  }

  /**
   * Verificar estado de admin desde el almacenamiento
   */
  private checkStoredAdminStatus(): boolean {
    const userRole = sessionStorage.getItem('userRole');
    const userType = sessionStorage.getItem('userType');
    
    return this.isAdminRole(userRole || '') || this.isAdminRole(userType || '');
  }

  /**
   * Método público para verificar si el usuario actual es administrador
   */
  isAdmin(): boolean {
    return this.currentUserIsAdmin.value;
  }

  /**
   * Observable para el estado de admin
   */
  get userIsAdmin(): Observable<boolean> {
    return this.currentUserIsAdmin.asObservable();
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const userRole = sessionStorage.getItem('userRole');
    const userType = sessionStorage.getItem('userType');
    
    return userRole === role || userType === role;
  }

  /**
   * Obtener información del usuario actual
   */
  getCurrentUser(): any {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        return null;
      }
    }
    return null;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error ', error.error);
    } else {
      console.error('Backend retornó el código de estado ', error);
    }
    return throwError(
      () => new Error('Algo falló. Por favor intente nuevamente.')
    );
  }

  get userData(): Observable<String> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  get userToken(): String {
    return this.currentUserData.value;
  }

  get userTokenHeader(): HttpHeaders {
    const token = this.currentUserData.value || '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return headers;
  }
}
