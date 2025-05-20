import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { Usuario } from '../../../interface/usuario';
import { RegisterService } from '../../../services/auth/register.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-registro-de-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro-de-usuarios.component.html',
  styleUrl: './registro-de-usuarios.component.css'
})

export class RegistroDeUsuariosComponent {
  
  public showPassword = false;
  public showConfirmPassword = false;
  public passwordErrors: string[] = [];
  public formSubmitted = false;

  constructor(private registerService: RegisterService, private router: Router, private formBuild: FormBuilder ){ }

  public formRegistro: FormGroup = this.formBuild.group({
    username: ['', Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    ]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Método para verificar errores de contraseña
  checkPasswordErrors() {
    this.passwordErrors = [];
    const passwordControl = this.formRegistro.get('password');

    if (passwordControl?.errors?.['required']) {
      this.passwordErrors.push('La contraseña es requerida');
    }

    if (passwordControl?.errors?.['minlength']) {
      this.passwordErrors.push('La contraseña debe tener al menos 4 caracteres');
    }

    if (passwordControl?.errors?.['pattern']) {
      this.passwordErrors.push('La contraseña debe contener mayúsculas, minúsculas y números');
    }

    if (this.formRegistro.errors?.['mismatch'] && this.formRegistro.get('confirmPassword')?.touched) {
      this.passwordErrors.push('Las contraseñas no coinciden');
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  registrarse() {
    this.formSubmitted = true;
    this.checkPasswordErrors();

    if (this.formRegistro.invalid || this.passwordErrors.length > 0) {
      return;
    }

    const objeto: Usuario = {
      username: this.formRegistro.value.username,
      first_name: this.formRegistro.value.first_name,
      last_name: this.formRegistro.value.last_name,
      email: this.formRegistro.value.email,
      password: this.formRegistro.value.password
    }

    this.registerService.registrarse(objeto).subscribe({
      next: (data) => {
        this.router.navigate(['/login'])
      }, 
      error: (error) => {
        console.log(error.message);
      }
    })
  }
}