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
    if (!this.listaProductos || this.listaProductos.length === 0) {
      return 0;
    }
    
    this.total = this.listaProductos.reduce((total, producto) => {
      const precio = Number(producto.Precio) || 0;
      const cantidad = Math.max(1, Number(producto.Cantidad) || 1);
      return total + (precio * cantidad);
    }, 0);
    
    return this.total;
  }

  comprar(){
    if (this.listaProductos.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const montoCompra = this.getTotal();
    
    if (montoCompra <= 0) {
      alert('El total de la compra debe ser mayor a 0');
      return;
    }

    const confirmarCompra = window.confirm('¿Confirmar la compra por un total de $' + montoCompra + '?');
    
    if (!confirmarCompra) {
      return;
    }

    this.carritoService.createCarrito().subscribe({
      next: () => {
        this.carritoService.resetCarrito().subscribe({
          next: () => {
            alert('¡Compra confirmada por un monto de $' + montoCompra + '!');
            this.listaProductos = [];
            this.total = 0;
            this.router.navigate(['/']);
          },
          error: () => {
            alert('Compra procesada, pero ocurrió un error al vaciar el carrito');
            this.listaProductos = [];
            this.total = 0;
            this.carritoService.actualizarProductosCarrito();
            this.router.navigate(['/']);
          }
        });
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
    if (producto.Cantidad <= 1) {
      return; 
    }

    this.carritoService.deleteUnProducto(producto).subscribe({
      next: (productoActualizado) => {
        if (productoActualizado && productoActualizado.Cantidad !== undefined) {
          producto.Cantidad = Math.max(1, productoActualizado.Cantidad);
        } else {
          producto.Cantidad = Math.max(1, producto.Cantidad - 1);
        }
      },
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
