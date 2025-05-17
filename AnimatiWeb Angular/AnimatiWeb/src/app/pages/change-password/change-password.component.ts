import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading = false;
  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      password2: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });

    this.loginService.userLoginOn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.passwordForm.statusChanges.subscribe(status => console.log('Estado del formulario:', status));
  }

  get password() {
    return this.passwordForm.get("password");
  }

  get password2() {
    return this.passwordForm.get("password2");
  }

  passwordValidator(control: any) {
    const password = control.value;

    if (!password) return null; // Evita errores al estar vacío
    if (password.length < 6) return { invalidPassword: 'Debe tener al menos 6 caracteres.' };
    if (!/[a-z]/.test(password)) return { invalidPassword: 'Debe incluir una letra minúscula.' };
    if (!/[A-Z]/.test(password)) return { invalidPassword: 'Debe incluir una letra mayúscula.' };
    if (!/\d/.test(password)) return { invalidPassword: 'Debe incluir un número.' };

    return null;
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const password2 = group.get('password2')?.value;

    if (!password || !password2) return null; // Evita mostrar error si alguno está vacío
    return password === password2 ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (!this.isLoggedIn) {
      this.errorMessage = 'Necesitas iniciar sesión para cambiar tu contraseña.';
      return;
    }

    if (this.passwordForm.invalid) {
      this.errorMessage = 'Las contraseñas no cumplen con los requisitos.';
      return;
    }

    this.isLoading = true;

    const body = {
      password: this.passwordForm.value.password,
      password2: this.passwordForm.value.password2
    };

    console.log('Enviando al backend:', body);

    const headers = this.loginService.userTokenHeader;

    this.http.post(environment.API_END_POINT + environment.METHODS.RECOVERY_PASS, body, { headers })
      .subscribe({
        next: () => {
          this.successMessage = 'Contraseña modificada correctamente.';
          setTimeout(() => {
            this.loginService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          const msg = err.error?.message || 'Error al actualizar la contraseña.';
          this.errorMessage = msg.includes('Invalid token') ? 'Sesión expirada. Vuelve a iniciar sesión.' : msg;
        },
        complete: () => {
          this.isLoading = false;
          this.passwordForm.reset();
        }
      });
  }

  volverAlInicio() {
    this.router.navigate(['/']);
  }
}