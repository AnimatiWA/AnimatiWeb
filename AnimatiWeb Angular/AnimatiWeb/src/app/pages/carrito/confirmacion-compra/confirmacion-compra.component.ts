import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/localStorage/local-storage.service';

@Component({
  selector: 'app-confirmacion-compra',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmacion-compra.component.html',
  styleUrls: ['./confirmacion-compra.component.css']
})
export class ConfirmacionCompraComponent implements OnInit {
  total: number = 0;
  items: number = 0;
  ordenId: string = '';
  fecha: string = '';
  fechaFormateada: string = '';
  metodoPago: string = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    // Recuperar los datos de la compra desde los query params
    this.route.queryParams.subscribe(params => {
      this.total = Number(params['total']) || 0;
      this.items = Number(params['items']) || 0;
      this.ordenId = params['ordenId'] || this.generarOrdenId();
      this.fecha = params['fecha'] || new Date().toISOString();
      this.metodoPago = params['metodoPago'] || 'No especificado';
      this.fechaFormateada = this.formatearFecha(this.fecha);
    });
  }

  generarOrdenId(): string {
    return 'ORD-' + Date.now().toString().slice(-8);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  volverAInicio(): void {
    this.router.navigate(['/']);
  }

  verHistorialCompras(): void {
    this.router.navigate(['/usuario/historial-compras']);
  }
}
