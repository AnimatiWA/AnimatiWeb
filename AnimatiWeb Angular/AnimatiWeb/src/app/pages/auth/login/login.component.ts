import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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
  loginError:string="";
  loginform!:FormGroup;
  
  constructor(private formBuilder: FormBuilder, private router:Router, private loginService:LoginService)
  { 
    this.loginform=this.formBuilder.group(
      {
        username:['',[Validators.required, Validators.minLength(4) ],[]],
        password:['',[Validators.required, Validators.minLength(4)],[]]
      }
    )
  }

  ngOnInit(): void {
  }

  get password()
  {
  return this.loginform.get("password");
  }
  get username()
  {
  return this.loginform.get("username");
  }

  login()
  {
   
    if(this.loginform.valid){
      this.loginService.login(this.loginform.value as LoginRequest).subscribe({
        next: (userData) =>{
          console.log(userData);
        },
        error: (errorData) =>{
          console.error(errorData);
          this.loginError = errorData;
        },
        complete: () =>{
          console.info('Login completo');
          this.router.navigateByUrl('/gallery');
          this.loginform.reset();
        }
      })
      
    }
    else
    {
      this.loginform.markAllAsTouched();
    }
  }

  
}

