import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Producto } from '../../../interface/prductolista';
import { ProductoCarrito } from '../../../interface/prductoCarritolista';
import { CarritoService } from '../../../services/carritoServices/carrito.service';
import { PurchaseHistoryService } from '../../../services/purchase/purchase-history.service';
import { Router } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';

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

  loading: boolean = false;
  error: string | null = null;

  constructor(
    private carritoService: CarritoService, 
    private purchaseHistoryService: PurchaseHistoryService,
    private router: Router
  ) { }

  // Sistema de notificaciones no bloqueantes
  private mensajeElement: HTMLElement | null = null;
  private mensajeTimeout: any = null;
  
  /**
   * Muestra un mensaje no bloqueante en la interfaz
   * @param mensaje Texto a mostrar
   * @param tipo Tipo de mensaje: 'success', 'error', 'info'
   */
  mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'info' = 'info'): void {
    // Eliminar cualquier notificación anterior
    if (this.mensajeElement) {
      document.body.removeChild(this.mensajeElement);
      clearTimeout(this.mensajeTimeout);
    }
    
    // Crear elemento de notificación
    const messageDiv = document.createElement('div');
    messageDiv.textContent = mensaje;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.padding = '15px 20px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.transition = 'opacity 0.5s';
    messageDiv.style.opacity = '0';
    messageDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    
    // Configurar estilo según tipo
    switch (tipo) {
      case 'success':
        messageDiv.style.backgroundColor = '#4CAF50';
        messageDiv.style.color = 'white';
        break;
      case 'error':
        messageDiv.style.backgroundColor = '#F44336';
        messageDiv.style.color = 'white';
        break;
      default: // info
        messageDiv.style.backgroundColor = '#2196F3';
        messageDiv.style.color = 'white';
    }
    
    // Añadir a DOM
    document.body.appendChild(messageDiv);
    this.mensajeElement = messageDiv;
    
    // Mostrar con animación
    setTimeout(() => {
      if (messageDiv) {
        messageDiv.style.opacity = '1';
      }
    }, 10);
    
    // Ocultar automáticamente
    this.mensajeTimeout = setTimeout(() => {
      if (messageDiv) {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
          if (messageDiv && messageDiv.parentNode) {
            document.body.removeChild(messageDiv);
          }
          if (this.mensajeElement === messageDiv) {
            this.mensajeElement = null;
          }
        }, 500);
      }
    }, 3000);
  }
  
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
    this.checkout();
  }

  checkout() {
    // Verificar que hayan productos en el carrito
    if (!this.listaProductos.length) {
      this.mostrarMensaje('El carrito está vacío', 'error');
      return;
    }
    
    // Redirigir al componente de métodos de pago
    const montoCompra = this.total;
    const cantidadItems = this.listaProductos.reduce((total, item) => total + (item.Cantidad || 0), 0);
    
    this.router.navigate(['/metodo-pago'], {
      queryParams: {
        total: montoCompra,
        items: cantidadItems
      }
    });
  }

  // Este método se mantiene para compatibilidad con código existente
  finalizarCompra() {
    this.checkout();
  }

  private procesarCompraDirecta(montoCompra: number, cantidadItems: number) {
    this.loading = true;
    this.error = null;

    // Primero registramos la compra en el historial
    this.purchaseHistoryService.registrarCompra({
      total: montoCompra,
      items: cantidadItems
    }).pipe(
      catchError(error => {
        console.error('Error al registrar la compra en el historial:', error);
        return of(null); // Continuamos con el proceso aunque falle el registro en historial
      }),
      finalize(() => {
        // Procesar el carrito independientemente de si se registró en el historial
        this.carritoService.createCarrito().subscribe({
          next: (carrito) => {
            const ordenId = 'ORD-' + Date.now().toString().slice(-8);
            this.carritoService.resetCarrito().subscribe({
              next: () => {
                this.loading = false;
                this.listaProductos = [];
                this.total = 0;
                this.carritoService.actualizarProductosCarrito();
                
                // Navegar a la página de confirmación con los datos de la compra
                this.router.navigate(['/confirmacion-compra'], {
                  queryParams: {
                    total: montoCompra,
                    items: cantidadItems,
                    ordenId: ordenId,
                    fecha: new Date().toISOString()
                  }
                });
              },
              error: (err) => {
                this.loading = false;
                this.error = 'Error al vaciar el carrito';
                console.error('Error al resetear el carrito:', err);
                alert('Compra procesada, pero ocurrió un error al vaciar el carrito');
                this.listaProductos = [];
                this.total = 0;
                this.carritoService.actualizarProductosCarrito();
                this.router.navigate(['/']);
              }
            });
          },
          error: (err) => {
            this.loading = false;
            this.error = 'No se pudo confirmar la compra';
            console.error('Error al crear el carrito:', err);
            alert('No se pudo confirmar la compra');
          }
        });
      })
    ).subscribe();
  }

  deleteProducto(producto: ProductoCarrito){
    // Almacenamos el índice antes de eliminar para no perderlo
    const indiceProducto = this.listaProductos.indexOf(producto);
    
    // Hacemos una eliminación optimista para actualizar la UI inmediatamente
    if (indiceProducto > -1) {
      this.listaProductos.splice(indiceProducto, 1);
    }
    
    // Recalcular el total inmediatamente
    this.getTotal();
    
    // Mostrar el loading
    this.loading = true;
    
    // La eliminación ya llama internamente a actualizarProductosCarrito()
    this.carritoService.deleteProducto(producto).subscribe({
      next: () => {
        this.loading = false;
        
        // Usamos una notificación no bloqueante
        this.mostrarMensaje('Producto eliminado', 'success');
      },
      error: (err) => {
        // Si falla, revertimos la operación local
        this.loading = false;
        this.carritoService.actualizarProductosCarrito();
        this.mostrarMensaje('Error al eliminar producto', 'error');
        console.error('Error al eliminar producto:', err);
      },
    });
  }

  deleteUnProducto(producto: ProductoCarrito){
    if (producto.Cantidad <= 1) {
      return; 
    }
    
    // Actualización optimista local
    const cantidadOriginal = producto.Cantidad;
    producto.Cantidad = Math.max(1, producto.Cantidad - 1);
    
    // Recalcular el total inmediatamente
    this.getTotal();
    
    this.loading = true;
    
    this.carritoService.deleteUnProducto(producto).subscribe({
      next: (productoActualizado) => {
        if (productoActualizado && productoActualizado.Cantidad !== undefined) {
          producto.Cantidad = Math.max(1, productoActualizado.Cantidad);
          this.getTotal();
        }
        this.loading = false;
        this.mostrarMensaje('Producto eliminado', 'info');
      },
      error: (err) => {
        // Revertir al valor original en caso de error
        producto.Cantidad = cantidadOriginal;
        this.getTotal();
        this.loading = false;
        this.mostrarMensaje('No se ha podido eliminar el producto', 'error');
        console.error('Error al eliminar unidad del producto:', err);
      },
    });
  }
  
  addUnProducto(producto: ProductoCarrito){
    // Actualización optimista local
    const cantidadOriginal = producto.Cantidad;
    producto.Cantidad += 1;
    
    // Recalcular el total inmediatamente
    this.getTotal();
    
    this.loading = true;
    
    this.carritoService.addUnProducto(producto).subscribe({
      next: () => {
        this.loading = false;
        this.mostrarMensaje('Producto añadido', 'success');
      },
      error: (err) => {
        // Revertir al valor original en caso de error
        producto.Cantidad = cantidadOriginal;
        this.getTotal();
        this.loading = false;
        this.mostrarMensaje('No se ha podido agregar una unidad al producto', 'error');
        console.error('Error al agregar unidad al producto:', err);
      },
    });
  }
}
