import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carritoServices/carrito.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

viewCart: boolean = false;
logueado: boolean = false;
  constructor(private loginService:LoginService, private router:Router, private carritoService: CarritoService){}
  ngOnInit(): void {
    
    this.loginService.userLoginOn.subscribe({

      next: (estado) => {

        this.logueado = estado;
      }
    })
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
