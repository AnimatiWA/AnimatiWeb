import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Categoria } from '../../interface/categoria';
import { Producto } from '../../interface/prductolista';
import { objetoProducto } from '../../pages/admin/productos/productos.component';



@Injectable({
  providedIn: 'root'

})
export class ProductService {
  Codigo_Producto!: objetoProducto[];
  private miLista:Producto[]=[];
  private miCarrito= new BehaviorSubject<Producto[]>([])
  miCarrito$ = this.miCarrito

  constructor(private http: HttpClient) { }

  getToken(){

    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({

        'Authorization': `Bearer ${token}`
    });

    return headers
  }

  getAllCategorias(){

    const headers = this.getToken();

    return this.http.get<Categoria[]>(environment.API_END_POINT + environment.METHODS.GET_ALL_CATEGORY, { headers });
  }

  getProductos(){

    const headers = this.getToken();

    return this.http.get<Producto[]>(environment.API_END_POINT + environment.METHODS.GET_ALL_PRODUCT);
  }

  getProductoCodigo(Codigo_Producto:number){
    return this.http.get<Producto["Codigo_Producto"]>(environment.API_END_POINT + environment.METHODS.GET_PRODUCT_BY_ID)
  }

  gurdarProducto(obj: any){

    const headers = this.getToken();
    
    return this.http.post(environment.API_END_POINT + environment.METHODS.CREATE_PRODUCT, obj, { headers });
  }

  actulizarProducto(obj:any):Observable<any>{

    const headers = this.getToken();
    
    return this.http.put<Producto["Codigo_Producto"]>(environment.API_END_POINT + environment.METHODS.UPDATE_PRODUCT, obj, { headers }).pipe(

    )
  }
  eliminarProducto(Codigo_Producto: any){

    const headers = this.getToken();
    
    return this.http.delete<Producto["Codigo_Producto"]>(environment.API_END_POINT + environment.METHODS.DELETE_PRODUCT + Codigo_Producto, { headers });
  }

  agregarProductoCarrito(producto:Producto){
    if(this.miLista.length ===0){
      alert('Se Agrego Un Producto ')
      producto.Cantidad=1;
      this.miLista.push(producto);
      this.miCarrito.next(this.miLista);
    }else{
      const productoModificado=this.miLista.find((elemento)=>{
        return elemento.Codigo_Producto === producto.Codigo_Producto
      })
      if(productoModificado){
        alert('Se Agrego Un Unidad ')
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
