import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../../services/auth/login.service';
import { LoginRequest } from '../../../services/auth/loginRequest';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginError: string = '';
  isLoading = false;
  loginform: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService) {
    this.loginform = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get password() {
    return this.loginform.get("password");
  }

  get username() {
    return this.loginform.get("username");
  }

  login() {
    if (this.loginform.valid) {
      this.isLoading = true;
      this.loginService.login(this.loginform.value as LoginRequest).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.error(errorData);
          this.loginError = errorData?.message || 'Error desconocido';
          this.isLoading = false;
        },
        complete: () => {
          console.info('Login completo');
          this.router.navigateByUrl('/gallery');
          this.loginform.reset();
          this.isLoading = false;
        }
      });
    } else {
      this.loginform.markAllAsTouched();
    }
  }
}