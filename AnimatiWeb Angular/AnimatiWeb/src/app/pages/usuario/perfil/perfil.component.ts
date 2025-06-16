import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/localStorage/local-storage.service';
import { AvatarService } from '../../../services/avatar/avatar.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: User = new User();
  errorMessage: string = '';
  usuarioEditado: User = new User();
  modoEdicion: boolean = false;
  
  avatares: string[] = [
    'avatar1.png',
    'avatar2.png',
    'avatar3.png',
    'avatar4.png',
    'avatar5.png',
    'avatar6.png',
    'avatar7.png',
    'avatar8.png',
    'avatar9.png'
  ];
  
  avatarSeleccionado: string = 'avatar1.png';
  avatarEdicion: string = 'avatar1.png';

  constructor(
    private userService: UserService, 
    private router: Router,
    private localStorage: LocalStorageService,
    private avatarService: AvatarService
  ) {
    // Intentar recuperar avatar guardado
    this.avatarService.avatar$.subscribe(avatar => {
      this.avatarSeleccionado = avatar;
      this.avatarEdicion = avatar;
    });
  }

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
    this.avatarEdicion = this.avatarSeleccionado;
  }
  
  seleccionarAvatar(avatar: string): void {
    this.avatarEdicion = avatar;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.errorMessage = '';
  }

  guardarCambios(): void {
    // El email no se modifica, actualizamos solo nombre y apellido pero mantenemos los otros campos
    this.usuarioEditado.email = this.usuario.email; // Aseguramos que el email no cambie
    
    this.userService.updateUser(this.usuarioEditado).subscribe({
      next: (data: User) => {
        this.usuario = data;
        this.modoEdicion = false;
        this.errorMessage = '';
        
        // Guardar y notificar el cambio de avatar
        this.avatarSeleccionado = this.avatarEdicion;
        this.avatarService.updateAvatar(this.avatarSeleccionado);
      },
      error: (err) => {
        console.error('Error al guardar los cambios:', err);
        this.errorMessage = 'No se pudieron guardar los cambios.';
      },
    });
  }

  irACambiarContrasena(): void {
    this.router.navigate(['/cambio-contrasena']);
  }

  irAHistorialCompras(): void {
    this.router.navigate(['/usuario/historial-compras']);
  }
}
