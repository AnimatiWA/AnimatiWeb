import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { Usuario } from '../../../interface/usuario';



@Component({
  selector: 'app-registro-de-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro-de-usuarios.component.html',
  styleUrl: './registro-de-usuarios.component.css'
})

export class RegistroDeUsuariosComponent {
  private accesoService = inject(AuthService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    username: ['',Validators.required],
    first_name: ['',Validators.required],
    last_name: ['',Validators.required],
    email: ['',Validators.required],
    password: ['',Validators.required]
  })

  registrarse(){
    if(this.formRegistro.invalid) return;

    const objeto:Usuario = {
      username: this.formRegistro.value.username,
      first_name: this.formRegistro.value.first_name,
      last_name: this.formRegistro.value.last_name,
      email: this.formRegistro.value.email,
      password: this.formRegistro.value.password
    }

    this.accesoService.registrarse(objeto).subscribe({
      next: (data) =>{
        
        this.router.navigate(['/login'])
          
        
        
        
      }, error:(error) =>{
          console.log(error.message);
        }
    })

  }

  volver(){
      this.router.navigate([''])
  }
    
}

