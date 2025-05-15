import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, this.passwordValidator]],
      password2: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  // Validador para la contraseña
  passwordValidator(control: any) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return pattern.test(control.value) ? null : { invalidPassword: true };
  }

  // Validador para coincidencia de contraseñas
  passwordsMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get('password2')?.value
      ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.errorMessage = 'Las contraseñas no cumplen con los requisitos o no coinciden.';
      return;
    }

    const userId = localStorage.getItem('idUser');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      this.errorMessage = 'No se pudo obtener la información del usuario.';
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const body = {
      password: this.passwordForm.value.password,
      password2: this.passwordForm.value.password2
    };

    this.http.post(`https://animatiapp.up.railway.app/api/passwordrecovery/${userId}`, body, { headers })
      .subscribe({
        next: () => {
          this.successMessage = 'Contraseña actualizada exitosamente.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar la contraseña.';
          console.error(err);
        }
      });
  }
}
