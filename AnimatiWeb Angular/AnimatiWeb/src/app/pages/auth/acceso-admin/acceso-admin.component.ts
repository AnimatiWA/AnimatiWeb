import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoginService } from '../../../services/auth/login.service';
import { LoginRequest } from '../../../services/auth/loginRequest';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-acceso-admin',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './acceso-admin.component.html',
  styleUrl: './acceso-admin.component.css'
})
export class AccesoAdminComponent {

  
  loginObj:any = {username$:'',
    password$:''
  }
  constructor(private formBuilder: FormBuilder, private router:Router, private loginService:LoginService)
  { 

    
  }

  ngOnInit(): void {
  }

  

  onLogin()
  {
   
    if(this.loginObj.username$ == 'admin' && this.loginObj.password$=='admin'){
      this.router.navigateByUrl('/agregarproductos')
      
    }
    else
    {
      alert('Acceso Denegado')
    }
  }

}
