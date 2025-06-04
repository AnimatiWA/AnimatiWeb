import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  usuario: User = new User();
  errorMessage: string = '';
  usuarioEditado: User = new User();
  modoEdicion: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.cargarPerfilUsuario();
  }

  cargarPerfilUsuario(): void {
    this.userService.getPerfilUsuario().subscribe({
      next: (data: User) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al obtener el perfil del usuario:', err);
        this.errorMessage = 'No se pudo cargar el perfil del usuario.';
      },
    });
  }

  activarEdicion(): void {
    this.usuarioEditado = { ...this.usuario };
    this.modoEdicion = true;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.errorMessage = '';
  }

  guardarCambios(): void {
    this.userService.updateUser(this.usuarioEditado).subscribe({
      next: (data: User) => {
        this.usuario = data;
        this.modoEdicion = false;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error al guardar los cambios:', err);
        this.errorMessage = 'No se pudieron guardar los cambios.';
      },
    });
  }

  irACambiarContrasena(): void {
    this.router.navigate(['/change-password']);
  }
}
