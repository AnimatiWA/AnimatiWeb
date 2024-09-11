import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../services/productoServices/producto.service';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../interface/categoria';
import { LayoutComponent } from "../../../admin/pages/layout/layout.component";

@Component({
    selector: 'app-categories',
    standalone: true,
    templateUrl: './categorias.component.html',
    styleUrl: './categorias.component.css',
    imports: [CommonModule, FormsModule, RouterLink, LayoutComponent]
})
export class CategoriasComponent  {
  Productos$:Observable<any> 
  constructor(private productoService:ProductService){
    this.Productos$ = this.productoService.getAllCategorias().pipe(
      map(item=>{
        return item;
      })
    )
  }
  
  getAllCategoria(){

  }

  
}

