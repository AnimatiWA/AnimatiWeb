import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/productoServices/producto.service';
import { Categoria } from '../../../interface/categoria';
import { Producto } from '../../../interface/prductolista';
import { CategoriasComponent } from '../categorias/categorias.component';
import { Observable } from 'rxjs';
import { ErrorInterceptorService } from '../../../services/auth/error-interceptor.service';
import { LayoutComponent } from "../../../admin/pages/layout/layout.component";



@Component({
    selector: 'app-products',
    standalone: true,
    templateUrl: './productos.component.html',
    styleUrl: './productos.component.css',
    imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, AsyncPipe, CategoriasComponent, LayoutComponent]
})
export class ProductsComponent implements OnInit, OnDestroy {
  
  

  panelVisible:boolean = false;
  objetoProducto:objetoProducto =new objetoProducto()
  listaCategorias!: Categoria[] 
  listaProductos!: Producto[]
  productoCodigo!: Producto["Codigo_Producto"] 
  
  constructor(private productoServicio:ProductService, errorInterceptor:ErrorInterceptorService) { }
  
  
  ngOnDestroy(): void {
    
  }
  ngOnInit(): void {
    this.getAllCategorias();
    this.getProductos()
  }

  getAllCategorias(){
    this.productoServicio.getAllCategorias().subscribe(res => {
      this.listaCategorias = res;

    });
  }

  getProductos(){
    this.productoServicio.getProductos().subscribe(res => {
      this.listaProductos = res;
    });
  }

  getProductosCodigo(){
   
  }
  enviarProducto(){
    this.productoServicio.gurdarProducto(this.objetoProducto).subscribe((res:any) =>{
      if(res.result){
        alert(res.message)
        this.getProductos();
      }else{
        alert(res.message);
        
        
      }
    })
  }

  onEditarProducto(item:any){
    
    this.objetoProducto = item;
    this.panelVisible= true;

  }
  
  onEliminarProducto(item:any){
    const eliminar = confirm('¿Estas seguro de eliminar el producto?')
    if(eliminar){
      this.productoServicio.eliminarProducto(item.Codigo_Producto).subscribe((res:any) =>{
        
        if(res.result){
          alert('producto eliminado')
          this.getProductos();
        }else{
          alert(res.message)
        }
      })      
    }
  }

  actualizarProducto(){
    this.productoServicio.actulizarProducto(this.objetoProducto).subscribe(data =>{
      this.objetoProducto = data
      console.log(this.objetoProducto)

      if(data){
        alert(data)

        this.getProductos();
      }else{
        alert(data);
        
        
      }
    })
  }


  abrirPanelNuevoProducto(){
    this.panelVisible=true;
  }
  cerrarPanelNuevoProducto(){
    this.panelVisible=false;
  }
}

export class objetoProducto {
  Codigo_Producto: number;
  Id_Categoria: number;
  Nombre_Producto: string;
  Imagen: string;
  Precio: number;
  Stock: number;
    


  constructor() {
    this.Codigo_Producto = 0;
    this.Nombre_Producto = '';
    this.Imagen = '';
    this.Precio = 0;
    this.Stock = 0;
    this.Id_Categoria = 0;
    
  }

}