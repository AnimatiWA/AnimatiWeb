import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-arrepentimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './arrepentimiento.component.html',
  styleUrls: ['./arrepentimiento.component.css']
})
export class ArrepentimientoComponent {
  form: FormGroup;

  campos = [
    { nombre: 'nombre', label: 'Nombre', tipo: 'text' },
    { nombre: 'apellido', label: 'Apellido', tipo: 'text' },
    { nombre: 'dni', label: 'DNI', tipo: 'text', placeholder: 'Ej. 33333333' },
    { nombre: 'orden', label: 'Orden #', tipo: 'text' },
    { nombre: 'email', label: 'Email', tipo: 'email' },
    { nombre: 'motivo', label: 'Motivo de la solicitud', tipo: 'textarea' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      orden: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motivo: ['', Validators.required]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  getError(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.touched || control.valid) return null;

    if (control.errors?.['required']) return 'Este campo es obligatorio.';
    if (control.errors?.['email']) return 'Ingresá un email válido.';
    if (control.errors?.['pattern']) {
      if (controlName === 'dni') return 'Ingresá un DNI válido (7 u 8 dígitos).';
    }

    return 'Campo inválido.';
  }

  enviarPorWhatsapp() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Por favor, completá todos los campos correctamente antes de enviar el mensaje.');
      return;
    }

    const { nombre, apellido, dni, orden, email, motivo } = this.form.value;

    const mensaje = `Solicitud de devolución:
Nombre: ${nombre} ${apellido}
DNI: ${dni}
Orden #: ${orden}
Email: ${email}
Motivo: ${motivo}`;

    const telefono = '5493543650788';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje.trim())}`;
    window.open(url, '_blank');
  }
}