import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { MercadopagoService } from '../../../services/mercadopago/mercadopago.service';
import { CarritoService } from '../../../services/carritoServices/carrito.service';

@Component({
  selector: 'app-procesando-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './procesando-pago.component.html',
  styleUrl: './procesando-pago.component.css',
})
export class ProcesandoPagoComponent implements OnInit, OnDestroy {
  montoCompra: number = 0;
  cantidadItems: number = 0;
  // estadoPago: string = 'procesando';
  // mostrarBotones: boolean = false;
  estadoPago: string = 'pendiente';
  mostrarBotones: boolean = true;
  mensajeDemora: string = '';
  mostrarSpinner: boolean = true;
  pedidoId: number = 0;

  private pollingSub!: Subscription;
  private idPago: string = '123456'; // Simulado

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mercadoPagoService: MercadopagoService,
    private carritoService: CarritoService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.montoCompra = Number(params['total']) || 0;
      this.cantidadItems = Number(params['items']) || 0;
      this.pedidoId = Number(params['pedido']) || 0;

      if (!this.montoCompra || !this.cantidadItems) {
        this.router.navigate(['/carrito']);
      }
    });
    this.iniciarPolling();

    setTimeout(() => {
      if (this.estadoPago === 'procesando') {
        this.mensajeDemora =
          'El pago está demorando más de lo habitual. Por favor, espera o verifica tu historial de compras más tarde.';
        this.mostrarSpinner = false;
        this.detenerPolling();
      }
    }, 1200000);
  }

  ngOnDestroy(): void {
    this.detenerPolling();
  }

  iniciarPolling(): void {
    this.pollingSub = interval(5000).subscribe(() => {
      this.mercadoPagoService.consultarEstadoPago(this.pedidoId).subscribe({
        next: (response) => {
          if (response.estado == 'aprobado') {
            this.carritoService.getCarrito().subscribe();
            this.detenerPolling();
          }
          this.estadoPago = response.estado;
        },
        error: (err) => {
          this.estadoPago = err.estado;
        },
      });
    });
  }

  detenerPolling(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  volverAlHistorial(): void {
    this.router.navigate(['/usuario/historial-compras']);
  }

  volverATienda(): void {
    this.router.navigate(['/gallery']);
  }
}
