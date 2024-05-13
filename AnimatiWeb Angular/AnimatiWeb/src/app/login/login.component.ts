import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  form!:FormGroup;
  constructor(private formBuilder: FormBuilder)
  { 
    this.form=this.formBuilder.group(
      {
        email:['',[Validators.required, Validators.email],[]],
        password:['',[Validators.required, Validators.minLength(8)],[]]
      }
    )
  }

  get Password()
  {
  return this.form.get("Password");
  }
  get Email()
  {
  return this.form.get("Email");
  }

  onEnviar(event:Event)
  {
    console.log(this.form.value)

    event.preventDefault;
    if(this.form.valid){
      alert('Enviando Datos al Servidor...')
    }
    else
    {
      this.form.markAllAsTouched();
    }
  }

  
}

