import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SalesService } from '../../../services/sales/sales.service';
import { Ventas } from '../../../interface/ventaslista';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LayoutComponent } from "../../../admin/pages/layout/layout.component";
import { ErrorInterceptorService } from '../../../services/auth/error-interceptor.service';
import { RouterModule } from '@angular/router';




@Component({
  selector: 'app-sales',
  standalone: true,
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LayoutComponent
  ],
})


export class SalesComponent implements OnInit{
  panelVisible: boolean = false;
  venta!: Ventas;
  loading = false;

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loading = true;
    this.salesService.getVentas().subscribe({
      next: (data) => {
        this.venta = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Error al cargar datos');
      }
    });
  }
    get ticketPromedio(): number {
    if (!this.venta || !this.venta.total_ventas || this.venta.total_ventas === 0) {
      return 0;
    }
    return this.venta.total_ingresos / this.venta.total_ventas;
  }
}






