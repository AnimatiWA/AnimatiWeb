import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilComponent } from './perfil/perfil.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PerfilComponent],
  imports: [CommonModule, FormsModule],
})
export class UsuarioModule {}
