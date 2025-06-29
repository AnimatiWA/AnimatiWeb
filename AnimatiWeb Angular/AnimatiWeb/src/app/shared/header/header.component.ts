import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carritoServices/carrito.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{

viewCart: boolean = false;
logueado: boolean = false;
cartItemsCount: number = 0;
userAvatar: string = 'avatar1.png';
private cartSubscription: Subscription | undefined;

constructor(
  private loginService: LoginService, 
  private router: Router, 
  private carritoService: CarritoService,
  private localStorage: LocalStorageService
){}
  ngOnInit(): void {
    this.loginService.userLoginOn.subscribe({
      next: (estado) => {
        this.logueado = estado;
        
        if (estado) {
          this.subscribeToCartChanges();
          this.loadUserAvatar();
        }
      }
    });
  }
  
  private subscribeToCartChanges(): void {
    // Suscribirse a los cambios en el carrito para actualizar el contador en tiempo real
    this.cartSubscription = this.carritoService.cartItems$.subscribe(productos => {
      if (productos && Array.isArray(productos)) {
        // Calcular el número total de items (sumando todas las cantidades)
        this.cartItemsCount = productos.reduce((total, item) => {
          return total + (item.Cantidad || 0);
        }, 0);
      } else {
        this.cartItemsCount = 0;
      }
    });
    
    // Forzar una actualización inicial de los productos del carrito
    this.carritoService.actualizarProductosCarrito();
  }
  
  ngOnDestroy(): void {
    // Cancelar suscripciones para evitar memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadUserAvatar() {
    const avatarGuardado = this.localStorage.getItem('usuario_avatar');
    if (avatarGuardado) {
      this.userAvatar = avatarGuardado;
    }
  }
  
  irAPerfil() {
    this.router.navigate(['/usuario/perfil']);
  }

  logout():void {
    this.loginService.logout();
    this.router.navigate(['/']);
  
  }

  totalCart() {
    throw new Error('Method not implemented.');
    }
    deleteProduct(arg0: number) {
    throw new Error('Method not implemented.');
    }
    updateUnits(arg0: string,arg1: number) {
    throw new Error('Method not implemented.');
    }
    totalProduct(Precio: number, Cantidad: number) {
      return Precio * Cantidad
    }
    
}
