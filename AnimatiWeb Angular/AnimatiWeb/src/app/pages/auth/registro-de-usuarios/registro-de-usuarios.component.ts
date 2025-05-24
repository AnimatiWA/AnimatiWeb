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
    username: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]],
    first_name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]],
    last_name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[^\s]+$/)
    ]],
    confirmPassword: ['', Validators.required],
    termsAndConditions: [false, Validators.requiredTrue]
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
      console.log('Formulario inválido:', this.formRegistro.errors);
      return;
    }

    const objeto: Usuario = {
      username: this.formRegistro.value.username,
      first_name: this.formRegistro.value.first_name,
      last_name: this.formRegistro.value.last_name,
      email: this.formRegistro.value.email,
      password: this.formRegistro.value.password,
      termsAndConditions: this.formRegistro.value.termsAndConditions
    };

    console.log('Valores del formulario:', this.formRegistro.value);
    console.log('Objeto para enviar:', objeto);

    this.registerService.registrarse(objeto).subscribe({
      next: (data) => {
        console.log('Registro exitoso:', data);
        this.router.navigate(['/login']);
      }, 
      error: (error) => {
        console.error('Error completo:', error);
        console.error('Mensaje de error:', error.message);
        console.error('Status:', error.status);
        console.error('Error body:', error.error);
        
        let errorMessage = 'Error al registrar el usuario';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error && typeof error.error === 'object' && error.error.detail) {
          errorMessage = error.error.detail;
        }
        
        alert(errorMessage);
      }
    });
  }
}