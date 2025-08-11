import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../services/productoServices/producto.service';
import { Observable, map, combineLatest, BehaviorSubject } from 'rxjs';
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
export class CategoriasComponent implements OnInit {
  
  Productos$: Observable<any>;
  filteredCategorias: Observable<any>;
  searchTerm: string = '';
  private searchSubject = new BehaviorSubject<string>('');
  hasEstadoField: boolean = false;

  constructor(private productoService: ProductService) {
    this.Productos$ = this.productoService.getAllCategorias().pipe(
      map(categorias => {
        // Verificar si las categorías tienen campo de estado
        if (categorias && categorias.length > 0) {
          this.hasEstadoField = categorias[0].hasOwnProperty('estado') || 
                               categorias[0].hasOwnProperty('Estado') || 
                               categorias[0].hasOwnProperty('activo') ||
                               categorias[0].hasOwnProperty('Activo');
        }
        return categorias;
      })
    );

    // Configurar el filtrado reactivo
    this.filteredCategorias = combineLatest([
      this.Productos$,
      this.searchSubject.asObservable()
    ]).pipe(
      map(([categorias, searchTerm]) => {
        if (!searchTerm || searchTerm.trim() === '') {
          return categorias;
        }
        
        const term = searchTerm.toLowerCase().trim();
        return categorias?.filter((categoria: any) => 
          categoria.Nombre_Categoria?.toLowerCase().includes(term) ||
          categoria.Descripcion_Categoria?.toLowerCase().includes(term) ||
          categoria.Id_Categoria?.toString().includes(term)
        ) || [];
      })
    );
  }

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  onSearchChange(event: any): void {
    const value = event.target.value;
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  getAllCategoria() {
    // Método para refrescar categorías si es necesario
    this.Productos$ = this.productoService.getAllCategorias().pipe(
      map(item => {
        return item;
      })
    );
  }

  // Métodos adicionales para acciones de la tabla
  editarCategoria(categoria: any): void {
    console.log('Editando categoría:', categoria);
    // Implementar lógica de edición
  }

  verProductos(categoria: any): void {
    console.log('Ver productos de categoría:', categoria);
    // Implementar navegación a productos de la categoría
  }

  eliminarCategoria(categoria: any): void {
    console.log('Eliminando categoría:', categoria);
    // Implementar lógica de eliminación con confirmación
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.Nombre_Categoria}"?`)) {
      // Llamar al servicio para eliminar
      // this.productoService.deleteCategoria(categoria.Id_Categoria).subscribe(...)
    }
  }

  crearCategoria(): void {
    console.log('Creando nueva categoría');
    // Implementar lógica de creación
  }
}