import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../auth/login.service';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../../interface/prductolista';
import { ProductoCarrito } from '../../interface/prductoCarritolista';
import { Carrito } from '../../interface/carrito';
import { filter, switchMap, catchError, map, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carritoActivoId: number | null = null;
  private miLista:Producto[]=[];
  private miCarrito= new BehaviorSubject<Producto[]>([])
  miCarrito$ = this.miCarrito
  
  private cartItemsSubject = new BehaviorSubject<ProductoCarrito[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

constructor(private http: HttpClient, private loginService: LoginService) {

  const savedId = sessionStorage.getItem('carritoActivoId');
  if (savedId) {
    this.carritoActivoId = +savedId;
    this.actualizarProductosCarrito();
  }

  this.loginService.userLoginOn.pipe(
    filter(on => on),
    switchMap(() => this.getCarrito())
  ).subscribe(id => {
    this.carritoActivoId = id;
    if (id !== null) {
      sessionStorage.setItem('carritoActivoId', id.toString());
      this.actualizarProductosCarrito();
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

      return this.createProductoCarrito(producto.Codigo_Producto, producto.Cantidad).pipe(
        tap(() => this.actualizarProductosCarrito())
      );
    } else{

      return this.createCarrito().pipe(
        tap(carrito => this.carritoActivoId = carrito.id),
        switchMap(() => this.createProductoCarrito(producto.Codigo_Producto, producto.Cantidad)),
        tap(() => this.actualizarProductosCarrito())
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

    return this.http.post(environment.API_END_POINT + environment.METHODS.CREATE_PRODUCT_CART, body, { headers });
  }

  getProductosCarrito(){

    const headers = this.loginService.userTokenHeader;

    return this.http.get<ProductoCarrito[]>(environment.API_END_POINT + environment.METHODS.GET_PRODUCT_CART_BY_ID + (this.carritoActivoId || 0), { headers });
  }
  
  actualizarProductosCarrito(): void {
    if (!this.carritoActivoId) {
      this.cartItemsSubject.next([]);
      return;
    }
    
    const headers = this.loginService.userTokenHeader;
    
    this.http.get<ProductoCarrito[]>(environment.API_END_POINT + environment.METHODS.GET_PRODUCT_CART_BY_ID + this.carritoActivoId, { headers })
      .subscribe(productos => {
        this.cartItemsSubject.next(productos);
      });
  }

  deleteProducto(producto: ProductoCarrito){

    const headers = this.loginService.userTokenHeader;

    return this.http.delete(environment.API_END_POINT + environment.METHODS.DELETE_PRODUCT_CART_BY_ID + producto.id, { headers }).pipe(
      tap(() => this.actualizarProductosCarrito())
    );
  }

  deleteUnProducto(producto: ProductoCarrito): Observable<any>{

    const headers = this.loginService.userTokenHeader;

    return this.http.patch(environment.API_END_POINT + environment.METHODS.DELETE_ONE_PRODUCT_CART_BY_ID + producto.id, {} , { headers }).pipe(
      tap(() => this.actualizarProductosCarrito())
    );
  }
  
  addUnProducto(producto: ProductoCarrito): Observable<any> {
    const headers = this.loginService.userTokenHeader;
    
    const body = {
      Codigo: producto.Codigo,
      Cantidad: 1,
    };
    
    return this.http.post(environment.API_END_POINT + environment.METHODS.CREATE_PRODUCT_CART, body, { headers }).pipe(
      tap(() => this.actualizarProductosCarrito())
    );
  }
  
  resetCarrito(): Observable<any> {
    if (!this.carritoActivoId) {
      return of({ success: true });
    }
    
    const headers = this.loginService.userTokenHeader;
    
    return this.getProductosCarrito().pipe(
      switchMap(productos => {
        if (!productos || productos.length === 0) {
          this.cartItemsSubject.next([]);
          return of({ success: true });
        }
        
        const deleteObservables = productos.map(producto => 
          this.http.delete(environment.API_END_POINT + environment.METHODS.DELETE_PRODUCT_CART_BY_ID + producto.id, { headers })
        );
        
        return deleteObservables.length > 0
          ? forkJoin(deleteObservables).pipe(
              tap(() => {
                this.cartItemsSubject.next([]);
              }),
              tap(() => {
                this.miCarrito.next([]);
              })
            )
          : of({ success: true });
      }),
      catchError(error => {
        this.cartItemsSubject.next([]);
        this.miCarrito.next([]);
        return of({ success: false, error });
      })
    );
  }

}
