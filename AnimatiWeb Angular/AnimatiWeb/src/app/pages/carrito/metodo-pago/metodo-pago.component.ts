import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CarritoService } from '../../../services/carritoServices/carrito.service';
import { PurchaseHistoryService } from '../../../services/purchase/purchase-history.service';
import { catchError, of, finalize } from 'rxjs';

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './metodo-pago.component.html',
  styleUrls: ['./metodo-pago.component.css']
})
export class MetodoPagoComponent implements OnInit {
  // Variables para validaciones de fecha
  currentYear: number = new Date().getFullYear();
  maxYear: number = new Date().getFullYear() + 10;
  // Datos de la compra
  montoCompra: number = 0;
  cantidadItems: number = 0;
  
  // Control de estados
  loading: boolean = false;
  error: string | null = null;
  metodoPagoSeleccionado: 'tarjeta' | 'transferencia' = 'tarjeta';
  comprobanteCargado: boolean = false;
  nombreArchivo: string = '';
  
  // Variables para WhatsApp
  numeroWhatsApp: string = '';
  whatsappContacto: string = '+5491112345678';
  comprobantePorWhatsAppEnviado: boolean = false;
  
  // Formularios
  formTarjeta: FormGroup;
  formTransferencia: FormGroup;
  
  // Formato de tarjetas aceptadas
  tiposTarjeta = [
    { nombre: 'Visa', pattern: '^4[0-9]{12}(?:[0-9]{3})?$', icono: 'fab fa-cc-visa' },
    { nombre: 'MasterCard', pattern: '^5[1-5][0-9]{14}$', icono: 'fab fa-cc-mastercard' },
    { nombre: 'American Express', pattern: '^3[47][0-9]{13}$', icono: 'fab fa-cc-amex' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private purchaseHistoryService: PurchaseHistoryService
  ) {
    // Inicializamos formulario de tarjeta
    this.formTarjeta = this.fb.group({
      numeroTarjeta: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{16}$')
      ]],
      titular: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      dni: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{8}$')
      ]],
      mesVencimiento: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(12)
      ]],
      anioVencimiento: ['', [
        Validators.required,
        Validators.min(new Date().getFullYear()),
        Validators.max(new Date().getFullYear() + 10)
      ]],
      cvv: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{3,4}$')
      ]]
    });
    
    // Inicializamos formulario de transferencia
    this.formTransferencia = this.fb.group({
      nombreTransferente: ['', Validators.required],
      numeroWhatsApp: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10,15}$') // Formato internacional sin +
      ]]
    });
  }

  ngOnInit(): void {
    // Obtenemos los datos del carrito
    this.route.queryParams.subscribe(params => {
      this.montoCompra = Number(params['total']) || 0;
      this.cantidadItems = Number(params['items']) || 0;
      
      if (!this.montoCompra || !this.cantidadItems) {
        // Si no hay datos, redirigimos al carrito
        this.router.navigate(['/carrito']);
      }
    });
  }
  
  // Método para detectar tipo de tarjeta según el número
  detectarTipoTarjeta(): string {
    const numero = this.formTarjeta.get('numeroTarjeta')?.value || '';
    
    for (const tipo of this.tiposTarjeta) {
      if (new RegExp(tipo.pattern).test(numero)) {
        return tipo.nombre;
      }
    }
    return '';
  }
  
  // Icono según tipo de tarjeta
  getIconoTarjeta(): string {
    const numero = this.formTarjeta.get('numeroTarjeta')?.value || '';
    
    for (const tipo of this.tiposTarjeta) {
      if (new RegExp(tipo.pattern).test(numero)) {
        return tipo.icono;
      }
    }
    return 'far fa-credit-card';
  }
  
  // Manejador de cambio de método de pago
  cambiarMetodoPago(metodo: 'tarjeta' | 'transferencia'): void {
    this.metodoPagoSeleccionado = metodo;
  }
  
  // Método para abrir WhatsApp con el número
  abrirWhatsApp(): void {
    if (this.formTransferencia.valid) {
      const nombre = this.formTransferencia.get('nombreTransferente')?.value;
      const whatsapp = this.formTransferencia.get('numeroWhatsApp')?.value;
      const mensaje = `Hola! Soy ${nombre}, realicé una transferencia por un total de $${this.montoCompra} para mi compra en AnimatiWeb. Adjunto comprobante.`;
      
      // URL para abrir WhatsApp con mensaje predefinido
      const whatsappUrl = `https://wa.me/${this.whatsappContacto}?text=${encodeURIComponent(mensaje)}`;
      
      // Abrimos en una nueva ventana
      window.open(whatsappUrl, '_blank');
      
      // Marcamos como enviado el comprobante
      this.comprobantePorWhatsAppEnviado = true;
    } else {
      this.formTransferencia.markAllAsTouched();
    }
  }
  
  // Método para procesar el pago según el método seleccionado
  procesarPago(): void {
    if (this.loading) return;
    
    let formularioValido = false;
    
    if (this.metodoPagoSeleccionado === 'tarjeta') {
      // Mostrar mensaje de método no disponible
      this.error = 'El pago con tarjeta no está disponible en este momento. Por favor, utilice la opción de transferencia bancaria.';
      this.cambiarMetodoPago('transferencia');
      return;
    } else if (this.metodoPagoSeleccionado === 'transferencia') {
      // Verificar que el formulario sea válido
      if (this.formTransferencia.invalid) {
        this.marcarCamposComoTocados(this.formTransferencia);
        return;
      }
      
      // Verificar que se haya enviado el comprobante por WhatsApp
      if (!this.comprobantePorWhatsAppEnviado) {
        this.error = 'Debe enviar el comprobante por WhatsApp antes de finalizar la compra.';
        return;
      }
    }
    
    this.loading = true;
    
    // Registro en historial y creación de orden
    this.procesarOrden();
  }
  
  // Método para marcar todos los campos como tocados (para mostrar errores)
  marcarCamposComoTocados(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(campo => {
      const control = formGroup.get(campo);
      control?.markAsTouched();
    });
  }
  
  // Método para procesar la orden
  private procesarOrden(): void {
    // Primero registramos la compra en el historial
    this.purchaseHistoryService.registrarCompra({
      total: this.montoCompra,
      items: this.cantidadItems,
      metodoPago: this.metodoPagoSeleccionado
    }).pipe(
      catchError(error => {
        console.error('Error al registrar la compra en el historial:', error);
        return of(null); // Continuamos con el proceso aunque falle el registro en historial
      }),
      finalize(() => {
        // Procesar el carrito independientemente de si se registró en el historial
        this.carritoService.createCarrito().subscribe({
          next: (carrito) => {
            const ordenId = 'ORD-' + Date.now().toString().slice(-8);
            this.carritoService.resetCarrito().subscribe({
              next: () => {
                this.loading = false;
                this.carritoService.actualizarProductosCarrito();
                
                // Navegar a la página de confirmación con los datos de la compra
                this.router.navigate(['/confirmacion-compra'], {
                  queryParams: {
                    total: this.montoCompra,
                    items: this.cantidadItems,
                    ordenId: ordenId,
                    fecha: new Date().toISOString(),
                    metodoPago: this.metodoPagoSeleccionado
                  }
                });
              },
              error: (err) => {
                this.loading = false;
                this.error = 'Error al vaciar el carrito';
                console.error('Error al resetear el carrito:', err);
                alert('Compra procesada, pero ocurrió un error al vaciar el carrito');
              }
            });
          },
          error: (err) => {
            this.loading = false;
            this.error = 'No se pudo confirmar la compra';
            console.error('Error al crear el carrito:', err);
            alert('No se pudo confirmar la compra');
          }
        });
      })
    ).subscribe();
  }
  
  // Método para volver al carrito
  volverAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }
}
