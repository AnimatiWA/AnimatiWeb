import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { LoginService } from '../../../services/auth/login.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  searchTxt: string = '';
  isAdmin: boolean = false;

  constructor(private loginSrv: LoginService, private router: Router) { }

  ngOnInit() {
    // Verificar si el usuario es admin
    this.checkAdminStatus();
  }

  checkAdminStatus() {
    // Aquí debes verificar según tu lógica de autenticación
    // Puede ser desde localStorage, un service, o decodificando el token
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    
    // Ejemplo: si guardas el rol en localStorage
    this.isAdmin = userRole === 'admin' || userRole === 'ADMIN';
    
    // O si tienes el rol en el token JWT, puedes decodificarlo aquí
    // this.isAdmin = this.loginSrv.isAdmin();
  }

  logout() {
    this.loginSrv.logout();
    this.router.navigate(['/']);
  }

  onFilter() {
    //this.loginSrv.searchBox.next(this.searchTxt);
  }

  onInput(event: any) {
    if (event.target.value.trim() === '') {
      this.onFilter();
    }
  }
}