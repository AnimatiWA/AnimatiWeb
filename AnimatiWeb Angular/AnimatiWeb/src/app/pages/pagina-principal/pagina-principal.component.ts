import { Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { ProductService } from '../../services/productoServices/producto.service';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../interface/prductolista';
import { CommonModule } from '@angular/common';
import { InfoBarComponent } from '../../shared/info-bar/info-bar.component';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  templateUrl: './pagina-principal.component.html',
  styleUrl: './pagina-principal.component.css',
  imports: [CommonModule, RouterModule, InfoBarComponent]
})
export class PaginaPrincipalComponent implements OnInit {
  listaProductos!: Producto[];
  constructor(private http: HttpClient, private productoService: ProductService) { }

  ngOnInit(): void {
    this.getAllProductos();
  }

  getAllProductos() {
    this.productoService.getProductos().subscribe(res => {
      this.listaProductos = res;
    });
  }
}
