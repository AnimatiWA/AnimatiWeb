import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SalesService } from '../../../services/sales/sales.service';
import { Ventas, MesesPrevios} from '../../../interface/ventaslista';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LayoutComponent } from "../../../admin/pages/layout/layout.component";
import { ErrorInterceptorService } from '../../../services/auth/error-interceptor.service';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);




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
template: `
    <div>
      <h3>Ingresos último trimestre</h3>
      <canvas #barCanvas></canvas>
    </div>
    <div>
    <h3>Gráfico de Ventas por Mes</h3>
      <canvas #pieCanvas></canvas>
    </div>
  `
})


export class SalesComponent implements OnInit{
  @ViewChild('barCanvas') barCanvas!: ElementRef;
  @ViewChild('pieCanvas') pieCanvas!: ElementRef;
  panelVisible: boolean = false;
  venta!: Ventas;
  barChart!: Chart;
  pieChart!: Chart;
  loading = false;


  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loading = true;
    this.salesService.getVentas().subscribe({
      next: (data) => {
        this.venta = data;
        this.loading = false;
        setTimeout(() => {
          this.createBarChart();
          this.createPieChart();
        }, 0);
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

  createBarChart() {
    const data = {
      labels: ['Último Mes', 'Penúltimo Mes', 'Antepenúltimo Mes'],
      datasets: [{
        label: 'Ventas',
        data: [
          this.venta.meses_previos.ultimo_mes,
          this.venta.meses_previos.penultimo_mes,
          this.venta.meses_previos.antepenultimo_mes
        ],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
        barThickness: 30
      }]
    };

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data,
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } } 
      }
    };

    if (this.barChart) this.barChart.destroy();
    this.barChart = new Chart(this.barCanvas.nativeElement, config);
  }

  createPieChart() {
    const data = {
      labels: ['Último Mes', 'Penúltimo Mes', 'Antepenúltimo Mes'],
      datasets: [{
        data: [
          this.venta.meses_previos.ultimo_mes,
          this.venta.meses_previos.penultimo_mes,
          this.venta.meses_previos.antepenultimo_mes
        ],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    };

    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data,
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    };

    if (this.pieChart) this.pieChart.destroy();
    this.pieChart = new Chart(this.pieCanvas.nativeElement, config);
  }
}

