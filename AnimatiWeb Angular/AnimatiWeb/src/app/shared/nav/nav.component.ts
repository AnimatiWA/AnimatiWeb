import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CarritoService } from '../../services/carritoServices/carrito.service';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { AvatarService } from '../../services/avatar/avatar.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit, OnDestroy {

  btnSecion: boolean = true;
  userLoginOn: boolean = false;
  userLoginOut: boolean = false;
  isAdmin: boolean = false; // Nueva propiedad para verificar si es admin
  cartItemsCount: number = 0;
  userAvatar: string = 'avatar1.png';
  mobileMenuActive: boolean = false;
  private cartSubscription: Subscription | undefined;
  private avatarSubscription: Subscription | undefined;
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(
    private loginService: LoginService, 
    private router: Router,
    private carritoService: CarritoService,
    private localStorage: LocalStorageService,
    private avatarService: AvatarService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUserLoginOn = new BehaviorSubject<boolean>(sessionStorage.getItem("token") != null); 
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.avatarSubscription) {
      this.avatarSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    // Suscribirse al estado de login
    this.loginService.userLoginOn.subscribe({
      next: (estado) => {
        console.log('NavComponent: Estado de login cambió:', estado);
        this.userLoginOn = estado;
        
        if (estado) {
          this.subscribeToCartChanges();
          this.subscribeToAvatarChanges();
        }
      }
    });

    // Suscribirse al estado de admin desde el servicio
    this.loginService.userIsAdmin.subscribe({
      next: (isAdmin) => {
        console.log('NavComponent: Estado de admin cambió a:', isAdmin);
        this.isAdmin = isAdmin;
        this.cdr.detectChanges(); // Forzar actualización de la vista
      }
    });

    // DEBUG: Verificar estado inicial
    console.log('NavComponent inicializado:');
    console.log('- userLoginOn:', this.userLoginOn);
    console.log('- isAdmin:', this.isAdmin);
    console.log('- token en sessionStorage:', !!sessionStorage.getItem('token'));
    console.log('- userRole en sessionStorage:', sessionStorage.getItem('userRole'));
    console.log('- userType en sessionStorage:', sessionStorage.getItem('userType'));
  }



  /**
   * Verifica si el usuario actual tiene permisos de administrador
   */
  private checkAdminStatus(): void {
    // Método 1: Verificar desde sessionStorage/localStorage
    const userRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
    const userType = sessionStorage.getItem('userType') || localStorage.getItem('userType');
    
    // Verificar diferentes formas en que puede estar guardado el rol
    this.isAdmin = 
      userRole === 'admin' || 
      userRole === 'ADMIN' || 
      userRole === 'administrador' ||
      userType === 'admin' ||
      userType === 'ADMIN';

    // Método 2: Si tienes un método en el servicio de login
    // this.isAdmin = this.loginService.isAdmin();

    // Método 3: Si el rol viene en el token JWT
    /*
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        const decodedToken = this.decodeJWT(token);
        this.isAdmin = decodedToken.role === 'admin' || decodedToken.role === 'ADMIN';
      }
    } catch (error) {
      console.error('Error al decodificar token:', error);
      this.isAdmin = false;
    }
    */

    console.log('Estado de admin:', this.isAdmin); // Para debugging
  }

  /**
   * Decodifica un token JWT (opcional, si usas JWT)
   */
  private decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error al decodificar JWT:', error);
      return null;
    }
  }
  
  private subscribeToCartChanges(): void {
    // Cancelar suscripción previa si existe
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }

    this.cartSubscription = this.carritoService.itemsCarrito$.subscribe(productos => {
      console.log('NavComponent: Actualizando contador del carrito con', productos.length, 'productos');
      if (productos && Array.isArray(productos)) {
        this.cartItemsCount = productos.reduce((total, item) => {
          return total + (item.Cantidad || 0);
        }, 0);
      } else {
        this.cartItemsCount = 0;
      }
      
      // Forzar la detección de cambios para actualizar la UI inmediatamente
      this.cdr.detectChanges();
    });
    
    // Solicitar una actualización inicial de los productos del carrito
    this.carritoService.actualizarProductosCarrito();
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/']);
  }
  
  subscribeToAvatarChanges(): void {
    this.avatarSubscription = this.avatarService.avatar$.subscribe(avatar => {
      this.userAvatar = avatar;
    });
  }
  
  irAPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  /**
   * Alterna el estado del menú móvil
   */
  toggleMobileMenu(): void {
    this.mobileMenuActive = !this.mobileMenuActive;
  }
  
  /**
   * Cierra el menú móvil
   */
  closeMobileMenu(): void {
    if (this.mobileMenuActive) {
      this.mobileMenuActive = false;
    }
  }

  /**
   * Método público para verificar si el usuario es admin (útil para el template)
   */
  checkIfAdmin(): boolean {
    return this.isAdmin;
  }
}