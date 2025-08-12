import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';
import { ContactoService, Contacto } from '../../services/contactoServices/contacto.service';

@Component({
  selector: 'app-contacto-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RecaptchaModule],
  templateUrl: './contacto-component.component.html',
  styleUrl: './contacto-component.component.css'
})
export class ContactoComponentComponent {

  contacto: Contacto = {
    nombre: '',
    email: '',
    mensaje: ''
  };

  captchaValido = true; // reCAPTCHA deshabilitado
  intentadoEnviar = false;

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent;

  constructor(private contactoService: ContactoService) {}

  onCaptchaResolved(token: string | null): void {
    this.captchaValido = !!token;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.intentadoEnviar = true;

    if (!this.captchaValido) {
      alert('Por favor, confirma que no eres un robot.');
      return;
    }

    this.contactoService.enviarMensaje(this.contacto).subscribe({
      next: () => {
        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        this.contacto = { nombre: '', email: '', mensaje: '' };
        this.captchaValido = false;
        this.intentadoEnviar = false;
        this.captchaRef.reset();
      },
      error: (err) => {
        console.error('❌ Error al enviar el mensaje', err);
        alert('Ocurrió un error al enviar tu mensaje. Intenta nuevamente más tarde.');
      }
    });
  }
}