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

  btnSecion:boolean = true;
  userLoginOn:boolean=false;
  userLoginOut:boolean=false;
  cartItemsCount: number = 0;
  userAvatar: string = 'avatar1.png';
  private cartSubscription: Subscription | undefined;
  private avatarSubscription: Subscription | undefined;
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(
    private loginService:LoginService, 
    private router:Router,
    private carritoService: CarritoService,
    private localStorage: LocalStorageService,
    private avatarService: AvatarService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null); 
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
    this.loginService.userLoginOn.subscribe({
      next:(estado) => {
        this.userLoginOn = estado;
        

        if (estado) {
          this.subscribeToCartChanges();
          this.subscribeToAvatarChanges();
        }
      }
    });
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



  logout():void {
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
}
