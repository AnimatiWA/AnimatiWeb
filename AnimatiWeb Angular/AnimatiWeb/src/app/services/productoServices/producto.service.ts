import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Categoria } from '../../interface/categoria';
import { Producto } from '../../interface/prductolista';
import { objetoProducto } from '../../pages/admin/productos/productos.component';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  Codigo_Producto!: objetoProducto[];

  constructor(private http: HttpClient, private auth: LoginService) {}

  getAllCategorias() {
    const headers = this.auth.userTokenHeader;

    return this.http.get<Categoria[]>(
      environment.API_END_POINT + environment.METHODS.GET_ALL_CATEGORY,
      { headers }
    );
  }

  getProductos() {
    const headers = this.auth.userTokenHeader;

    return this.http.get<Producto[]>(
      environment.API_END_POINT + environment.METHODS.GET_ALL_PRODUCT
    );
  }

  getProductoCodigo(Codigo_Producto: number) {
    return this.http.get<Producto['Codigo_Producto']>(
      environment.API_END_POINT + environment.METHODS.GET_PRODUCT_BY_ID
    );
  }

  gurdarProducto(obj: any) {
    const headers = this.auth.userTokenHeader;

    return this.http.post(
      environment.API_END_POINT + environment.METHODS.CREATE_PRODUCT,
      obj,
      { headers }
    );
  }

 actualizarProducto(codigo: number, obj: any): Observable<any> {
  const headers = this.auth.userTokenHeader;
  
  return this.http
    .put<any>(
      `${environment.API_END_POINT}${environment.METHODS.UPDATE_PRODUCT}${codigo}`,
      obj,
      { headers }
    )
    .pipe();
}

  eliminarProducto(Codigo_Producto: any) {
    const headers = this.auth.userTokenHeader;

    return this.http.delete<Producto['Codigo_Producto']>(
      environment.API_END_POINT +
        environment.METHODS.DELETE_PRODUCT +
        Codigo_Producto,
      { headers }
    );
  }
}
