import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

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
      verificationCode: ['', Validators.required],
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

    this.http.post(environment.API_END_POINT + environment.METHODS.RECOVERY_PASS_EMAIL, body)
      .subscribe({
        next: () => {
          this.successMessage = 'Su código de validación ha sido enviado.';
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

    if (this.recoveryForm.invalid) {
      this.errorMessage = 'Las contraseñas no cumplen con los requisitos o no coinciden.';
      return;
    }

    this.isLoading = true;
    const body = { 
      codigo: this.recoveryForm.value.verificationCode,
      password: this.recoveryForm.value.password,
      password2: this.recoveryForm.value.password2
    };

    this.http.post(environment.API_END_POINT + environment.METHODS.CHANGE_PASS, body)
      .subscribe({
        next: () => {
          this.successMessage = 'Contraseña modificada con éxito.';
          this.isCodeValidated = true;

          // 🔥 Redirigir al login solo si `successMessage` es correcto
          setTimeout(() => {
            if (this.successMessage === 'Contraseña modificada con éxito.') {
              this.router.navigate(['/login']);
            }
          }, 5000);
        },
        error: () => {
          this.errorMessage = 'El código ingresado no es válido.';
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