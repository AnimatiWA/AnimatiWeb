import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseHistoryService } from '../../../services/purchase/purchase-history.service';
import { PurchaseItem } from '../../../models/purchase-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-compras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.css']
})
export class HistorialComprasComponent implements OnInit {
  compras: PurchaseItem[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private purchaseHistoryService: PurchaseHistoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarHistorialCompras();
  }

  cargarHistorialCompras(): void {
    this.loading = true;
    this.purchaseHistoryService.getPurchaseHistory().subscribe({
      next: (data: PurchaseItem[]) => {
        this.compras = data.sort((a, b) => {
          return new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime();
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial de compras:', err);
        this.errorMessage = 'No se pudo cargar el historial de compras. Por favor intente más tarde.';
        this.loading = false;
      }
    });
  }

  volverAlPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
