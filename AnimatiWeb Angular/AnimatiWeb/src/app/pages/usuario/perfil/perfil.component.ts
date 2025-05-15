import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  usuario: User = new User();
  errorMessage: string = '';

  constructor(private userService: UserService) {}

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
}
