import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class RecoveryPasswordComponent {
  recoveryForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isCodeSent = false;
  isCodeValidated = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      verificationCode: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  // Validador para coincidencia de contraseñas
  passwordsMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get('password2')?.value
      ? null : { passwordsMismatch: true };
  }

  sendVerificationCode() {
    if (this.recoveryForm.get('email')?.invalid) {
      this.errorMessage = 'Ingrese un correo electrónico válido.';
      return;
    }

    this.isLoading = true;
    const body = { email: this.recoveryForm.value.email };

    this.http.post('https://animatiapp.up.railway.app/api/passwordRecovery', body)
      .subscribe({
        next: () => {
          this.successMessage = 'Código enviado al correo.';
          this.isCodeSent = true;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al enviar el código.';
          console.error(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  validateCode() {
    if (!this.recoveryForm.get('verificationCode')?.value) {
      this.errorMessage = 'Ingrese el código de verificación.';
      return;
    }

    this.isLoading = true;
    const body = { code: this.recoveryForm.value.verificationCode };

    this.http.post('https://animatiapp.up.railway.app/api/validate-code', body)
      .subscribe({
        next: () => {
          this.successMessage = 'Código validado correctamente.';
          this.isCodeValidated = true;
        },
        error: () => {
          this.errorMessage = 'Código incorrecto.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  updatePassword() {
    if (this.recoveryForm.invalid) {
      this.errorMessage = 'Las contraseñas no cumplen con los requisitos o no coinciden.';
      return;
    }

    this.isLoading = true;
    const body = {
      password: this.recoveryForm.value.password,
      password2: this.recoveryForm.value.password2
    };

    this.http.post('https://animatiapp.up.railway.app/api/update-password', body)
      .subscribe({
        next: () => {
          this.successMessage = 'Contraseña actualizada exitosamente.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar la contraseña.';
          console.error(err);
        },
        complete: () => {
          this.isLoading = false;
          this.recoveryForm.reset();
        }
      });
  }

  volverAlInicio() {
    this.router.navigate(['/']);
  }
}