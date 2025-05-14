import { Component } from '@angular/core';
import { ContactoService, Contacto } from '../../services/contactoServices/contacto.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-contacto-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto-component.component.html',
  styleUrl: './contacto-component.component.css'
})

export class ContactoComponentComponent {

  contacto: Contacto = {
    nombre: '',
    email: '',
    mensaje: ''
  };

  constructor(private contactoService: ContactoService) {}

  onSubmit() {
    this.contactoService.enviarMensaje(this.contacto).subscribe({
      next: (res) => {
        alert('Mensaje enviado con éxito');
        this.contacto = { nombre: '', email: '', mensaje: '' };
      },
      error: (err) => {
        console.error('Error al enviar el mensaje', err);
        alert('Error al enviar el mensaje');
      }
    });
  }
}
