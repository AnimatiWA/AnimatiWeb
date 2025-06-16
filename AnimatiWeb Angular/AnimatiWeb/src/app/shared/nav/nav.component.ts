import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CarritoService } from '../../services/carritoServices/carrito.service';

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
  private cartSubscription: Subscription | undefined;
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(private loginService:LoginService, 
              private router:Router,
              private carritoService: CarritoService) {
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null); 
  }
  ngOnDestroy(): void {

    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  

  ngOnInit(): void {
    this.loginService.userLoginOn.subscribe({
      next:(estado) => {
        this.userLoginOn = estado;
        

        if (estado) {
          this.subscribeToCartChanges();
        }
      }
    });
  }
  
  private subscribeToCartChanges(): void {

    this.cartSubscription = this.carritoService.cartItems$.subscribe(productos => {
      if (productos && Array.isArray(productos)) {

        this.cartItemsCount = productos.reduce((total, item) => {
          return total + (item.Cantidad || 0);
        }, 0);
      } else {
        this.cartItemsCount = 0;
      }
    });
    

    this.carritoService.actualizarProductosCarrito();
  }



  logout():void {
    this.loginService.logout();
    this.router.navigate(['/']);
  
  }
}
