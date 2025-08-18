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
  styleUrl: './carrito.component.css',
})
export class CarritoComponent {
  listaProductos!: ProductoCarrito[];
  total: number = 0;

  loading: boolean = false;
  error: string | null = null;

  constructor(
    private carritoService: CarritoService,
    private purchaseHistoryService: PurchaseHistoryService,
    private router: Router
  ) {}

  // Sistema de notificaciones no bloqueantes
  private mensajeElement: HTMLElement | null = null;
  private mensajeTimeout: any = null;


  //#region Aparte
  //Todo esto tendrian que haberlo hecho en un componente aparte

  /**
   * Muestra un mensaje no bloqueante en la interfaz
   * @param mensaje Texto a mostrar
   * @param tipo Tipo de mensaje: 'success', 'error', 'info'
   */
  mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' | 'info' = 'info'
  ): void {
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

  //#endregion

  ngOnInit(): void {
    
    this.carritoService.itemsCarrito$.subscribe((productos) => {
      this.listaProductos = productos;
    });

    this.carritoService.actualizarProductosCarrito();
  }

  getTotal() {
    if (!this.listaProductos || this.listaProductos.length === 0) {
      return 0;
    }

    this.total = this.listaProductos.reduce((total, producto) => {
      const precio = Number(producto.Precio) || 0;
      // const cantidad = Math.max(1, Number(producto.Cantidad) || 1);
      return total + precio;
    }, 0);

    return this.total;
  }

  comprar() {
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

    // Redirigir al componente de procesamiento de pago
    const montoCompra = this.total;
    const cantidadItems = this.listaProductos.reduce(
      (total, item) => total + (item.Cantidad || 0),
      0
    );

    this.carritoService.createPreference().subscribe({
      next: (response) => {
        window.open(response.init_point, '_blank');

        this.router.navigate(['/procesando-pago'], {
          queryParams: {
            total: montoCompra,
            items: cantidadItems,
            pedido: response.pedido_id,
          },
        });
      },
    });
  }

  deleteProducto(producto: ProductoCarrito) {

    // Mostrar el loading
    producto.loading = true;

    this.carritoService.deleteProducto(producto).subscribe({
      next: () => {
    
        const indiceProducto = this.listaProductos.indexOf(producto);

        if (indiceProducto > -1) {
          this.listaProductos.splice(indiceProducto, 1);
        }

        this.getTotal();

        producto.loading = false;

        // Usamos una notificación no bloqueante
        this.mostrarMensaje('Producto eliminado', 'success');
      },
      error: (err) => {
        // Si falla, revertimos la operación local
        producto.loading = false;
        this.mostrarMensaje('Error al eliminar producto', 'error');
        console.error('Error al eliminar producto:', err);
      },
    });
  }

  deleteUnProducto(producto: ProductoCarrito) {

    if (producto.Cantidad <= 1) {
      return;
    }

    producto.loading = true;

    const precioOriginal = producto.Precio;
    const cantidadOriginal = producto.Cantidad;

    const productoActualizado: ProductoCarrito = {
      ...producto,
      Precio: precioOriginal - (precioOriginal / cantidadOriginal),
      Cantidad: Math.max(1, cantidadOriginal - 1),
      loading: true,
    };

    producto = productoActualizado
    
    // Recalcular el total inmediatamente
    this.getTotal();

    this.carritoService.deleteUnProducto(producto).subscribe({

      next: (productoActualizado) => {

        if (productoActualizado && productoActualizado.Cantidad !== undefined) {
          producto.Cantidad = Math.max(1, productoActualizado.Cantidad);
          this.getTotal();
        }
        
        producto.loading = false;
        this.mostrarMensaje('Producto eliminado', 'info');
      },
      error: (err) => {
        // Revertir al valor original en caso de error
        producto.Cantidad = cantidadOriginal;
        producto.Precio = precioOriginal;
        this.getTotal();
        producto.loading = false;
        this.mostrarMensaje('No se ha podido eliminar el producto', 'error');
        console.error('Error al eliminar unidad del producto:', err);
      },
    });
  }

  addUnProducto(producto: ProductoCarrito) {
    
    //Flag de carga del boton.

    producto.loading = true;

    const precioOriginal = producto.Precio;
    const cantidadOriginal = producto.Cantidad;

    const productoActualizado: ProductoCarrito = {
      ...producto,
      Precio: precioOriginal + (precioOriginal / cantidadOriginal),
      Cantidad: cantidadOriginal + 1,
      loading: true,
    };

    producto = productoActualizado

    // Recalcular el total inmediatamente
    this.getTotal();

    this.carritoService.addUnProducto(producto).subscribe({
      next: () => {
        producto.loading = false;
        this.mostrarMensaje('Producto añadido', 'success');
      },
      error: (err) => {
        // Revertir al valor original en caso de error
        producto.loading = false;
        producto.Cantidad = cantidadOriginal;
        producto.Precio = precioOriginal;
        this.getTotal();
        this.mostrarMensaje(
          'No se ha podido agregar una unidad al producto',
          'error'
        );
        console.error('Error al agregar unidad al producto:', err);
      },
    });
  }
}
