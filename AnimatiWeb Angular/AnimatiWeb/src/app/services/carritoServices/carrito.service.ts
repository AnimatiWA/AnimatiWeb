import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../auth/login.service';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../../interface/prductolista';
import { ProductoCarrito } from '../../interface/prductoCarritolista';
import { Carrito } from '../../interface/carrito';
import { filter, switchMap, catchError, map, tap, of, throwError } from 'rxjs';
import { Preferencia } from '../../interface/preferencia';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carritoActivoId: number | null = null;
  private miLista:Producto[]=[];
  private miCarrito= new BehaviorSubject<Producto[]>([])
  public miCarrito$ = this.miCarrito

  private itemsCarrito = new BehaviorSubject<ProductoCarrito[]>([]);
  public itemsCarrito$ = this.itemsCarrito

constructor(private http: HttpClient, private loginService: LoginService) {

  const savedId = sessionStorage.getItem('carritoActivoId');
  if (savedId) {
    this.carritoActivoId = +savedId;
  }

  this.loginService.userLoginOn.pipe(
    filter(on => on),
    switchMap(() => this.getCarrito())
  ).subscribe(id => {
    this.carritoActivoId = id;
    if (id !== null) {
      sessionStorage.setItem('carritoActivoId', id.toString());
    }
  });
}
  
  private getCarrito(): Observable<number | null> {

    const headers = this.loginService.userTokenHeader;

    return this.http.get<Carrito>(environment.API_END_POINT + environment.METHODS.GET_CART_USER, { headers }).pipe(

      tap(carrito => this.carritoActivoId = carrito.id),
      map(carrito => carrito.id),
      catchError(() => of(null))
    );
  }

  agregarProducto(producto: Producto): Observable<any> {

    if (this.carritoActivoId){

      return this.createProductoCarrito(producto.Codigo_Producto, producto.Cantidad);
    } else{

      return this.createCarrito().pipe(
        tap(carrito => this.carritoActivoId = carrito.id),
        switchMap(() => this.createProductoCarrito(producto.Codigo_Producto, producto.Cantidad))
      );
    }
  }

  createCarrito(){

    const headers = this.loginService.userTokenHeader;

    return this.http.post<Carrito>(environment.API_END_POINT + environment.METHODS.CREATE_CART, {}, { headers });
  }

  createProductoCarrito(codigo: number, cantidad: number){

    const headers = this.loginService.userTokenHeader;

    const body = {

      Codigo: codigo,
      Cantidad: cantidad,
    }

    return this.http.post(environment.API_END_POINT + environment.METHODS.CREATE_PRODUCT_CART, body, { headers })
    .pipe(
        tap(() => this.actualizarProductosCarrito())
    );
  }

  getProductosCarrito(){

    const headers = this.loginService.userTokenHeader;

    return this.http.get<ProductoCarrito[]>(environment.API_END_POINT + environment.METHODS.GET_PRODUCT_CART_BY_ID + (this.carritoActivoId || 0), { headers });
  }

  //Carrito///////////////////////////////////////////////////////////////////////////////////////////////// NO LO MEZCLES GABY PORFAVOR

  actualizarProductosCarrito(): void {
    if (!this.carritoActivoId) {
      this.itemsCarrito.next([]);
      return;
    }

    const headers = this.loginService.userTokenHeader;

    this.http
      .get<ProductoCarrito[]>(environment.API_END_POINT + environment.METHODS.GET_PRODUCT_CART_BY_ID + this.carritoActivoId, { headers }).subscribe({
        next: (productos) => {
          console.log('Actualizando productos del carrito:', productos);
          this.itemsCarrito.next(productos);
        },
        error: (error) => {
          console.error('Error al obtener productos del carrito:', error);
          this.itemsCarrito.next([]);
        },
      });
  }

  addUnProducto(producto: ProductoCarrito): Observable<any> {
    const headers = this.loginService.userTokenHeader;

    const body = {
      Codigo: producto.Codigo,
      Cantidad: 1,
    };

    return this.http
      .post(environment.API_END_POINT + environment.METHODS.CREATE_PRODUCT_CART, body, { headers })
      .pipe(
        tap(() => {
          console.log('Unidad agregada en el servidor, actualizando carrito');
          this.actualizarProductosCarrito();
        }),
        catchError((error) => {
          console.error('Error al agregar unidad:', error);
          // Si hay error, revertimos la actualización local
          this.actualizarProductosCarrito();
          return throwError(() => error);
        })
      );
  }

  deleteProducto(producto: ProductoCarrito){

    const headers = this.loginService.userTokenHeader;

    return this.http.delete(environment.API_END_POINT + environment.METHODS.DELETE_PRODUCT_CART_BY_ID + producto.id, { headers })
    .pipe(
        tap(() => this.actualizarProductosCarrito())
    );
  }

  deleteUnProducto(producto: ProductoCarrito): Observable<any>{

    const headers = this.loginService.userTokenHeader;

    return this.http.patch(environment.API_END_POINT + environment.METHODS.DELETE_ONE_PRODUCT_CART_BY_ID + producto.id, {} , { headers })
    .pipe(
        tap(() => this.actualizarProductosCarrito())
    );
  }

  createPreference() {
    const headers = this.loginService.userTokenHeader;

    return this.http.post<Preferencia>(environment.API_END_POINT + environment.METHODS.CREATE_PREFERENCE, {}, { headers })
    .pipe(
        tap(() => this.actualizarProductosCarrito())
    );
  }
}
