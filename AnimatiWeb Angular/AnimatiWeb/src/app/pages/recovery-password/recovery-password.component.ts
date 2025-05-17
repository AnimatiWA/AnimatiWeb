import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule] // ✅ Importación correcta
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
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      password2: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  // Validación de requisitos de contraseña
  passwordValidator(control: any) {
    const password = control.value;

    if (!password) return null;
    if (password.length < 6) return { invalidPassword: 'Debe tener al menos 6 caracteres.' };
    if (!/[a-z]/.test(password)) return { invalidPassword: 'Debe incluir una letra minúscula.' };
    if (!/[A-Z]/.test(password)) return { invalidPassword: 'Debe incluir una letra mayúscula.' };
    if (!/\d/.test(password)) return { invalidPassword: 'Debe incluir un número.' };

    return null;
  }

  // Validación de coincidencia de contraseñas
  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const password2 = group.get('password2')?.value;

    if (!password || !password2) return null;
    return password === password2 ? null : { passwordsMismatch: true };
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
          this.successMessage = 'Código enviado. Revise su correo.';
          this.isCodeSent = true;
        },
        error: (err) => {
          console.error('Error completo:', err);
          this.errorMessage = err.error?.message || 'Error al enviar el código.';
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

    const passwordErrors = this.recoveryForm.get('password')?.errors;
    if (passwordErrors) {
      this.errorMessage = Object.values(passwordErrors)[0]; // ✅ Muestra el primer error específico
      return;
    }

    if (this.recoveryForm.invalid) {
      this.errorMessage = 'Las contraseñas no coinciden.';
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