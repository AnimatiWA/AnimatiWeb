import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../auth/login.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../../interface/prductolista';
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
  constructor(private http: HttpClient, private loginService: LoginService) {

     this.loginService.userLoginOn.pipe(
      filter(on => on),
      switchMap(() => this.getCarrito())
    ).subscribe(id => this.carritoActivoId = id);
   }

  private actualizaCarritoLocal(producto: Producto) {

    const indiceProducto = this.miLista.findIndex(prod => prod.Codigo_Producto === producto.Codigo_Producto);

    if(indiceProducto !== -1){ //Ya existe el producto, actualizo la cantidad.

      this.miLista[indiceProducto].Cantidad += producto.Cantidad;
    } else{ //No existe el producto, lo agrego al carrito

      this.miLista.push({ ...producto});
    }

    this.miCarrito.next([...this.miLista]);
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
        tap(() => this.actualizaCarritoLocal(producto))
      );
    } else{

      return this.createCarrito().pipe(
        tap(carrito => this.carritoActivoId = carrito.id),
        switchMap(() => this.createProductoCarrito(producto.Codigo_Producto, producto.Cantidad)),
        tap(() => this.actualizaCarritoLocal(producto))
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

  agregarProductoCarrito(producto:Producto){

    if(this.miLista.length ===0){

      alert('Se agrego un producto')
      producto.Cantidad=1;
      this.miLista.push(producto);
      this.miCarrito.next(this.miLista);
    }else{

      const productoModificado=this.miLista.find((elemento)=>{
        return elemento.Codigo_Producto === producto.Codigo_Producto
      })

      if(productoModificado){

        alert('Se Agrego Un Unidad')
        productoModificado.Cantidad += 1
        this.miCarrito.next(this.miLista);
      }else{

        alert('Se Agrego Un Producto Diferente')
        producto.Cantidad=1;
        this.miLista.push(producto)
        this.miCarrito.next(this.miLista);
      }
    }
  }
}
