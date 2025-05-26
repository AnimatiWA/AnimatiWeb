import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Producto } from '../../../interface/prductolista';
import { ProductoCarrito } from '../../../interface/prductoCarritolista';
import { CarritoService } from '../../../services/carritoServices/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  
    listaProductos!: ProductoCarrito[]
    total: number = 0

  constructor(private carritoService:CarritoService, private router:Router) { }

  ngOnInit(): void{

    this.carritoService.getProductosCarrito().subscribe({

      next: listaProductos => this.listaProductos = listaProductos,
      error: (err) => {

        alert(err.error.error);
        this.router.navigate(['/gallery']);
      },
    });
  }

  getTotal(){

    this.total = this.listaProductos.reduce((total, producto) => total + (producto.Precio * producto.Cantidad), 0)
    return this.total;
  }

  comprar(){

    this.carritoService.createCarrito().subscribe({
      next: () => {

        this.listaProductos = [];
        alert('Compra confirmada por un monto de $' + this.total);
        this.router.navigate(['/']);
      },
      error: () => alert('No se pudo confirmar la compra'),
    })
  }

  deleteProducto(producto: ProductoCarrito){

    this.carritoService.deleteProducto(producto).subscribe({

      next: () => {

        this.listaProductos.splice(this.listaProductos.indexOf(producto), 1)
        alert('Producto eliminado')
      },
      error: () => alert('Error al eliminar producto'),
    })
  }

  deleteUnProducto(producto: ProductoCarrito){

    this.carritoService.deleteUnProducto(producto).subscribe({

      next: (productoActualizado) => producto.Cantidad = productoActualizado.Cantidad,
      error: () => alert('No se ha podido eliminar el producto'),
    })
  }
  
  addUnProducto(producto: ProductoCarrito){
    this.carritoService.addUnProducto(producto).subscribe({
      next: () => {
        producto.Cantidad += 1;
      },
      error: () => alert('No se ha podido agregar una unidad al producto'),
    })
  }
}
