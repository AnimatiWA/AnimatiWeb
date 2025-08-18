import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/productoServices/producto.service';
import { Categoria } from '../../../interface/categoria';
import { Producto } from '../../../interface/prductolista';
import { CategoriasComponent } from '../categorias/categorias.component';
import { Observable } from 'rxjs';
import { ErrorInterceptorService } from '../../../services/auth/error-interceptor.service';
import { LayoutComponent } from "../../../admin/pages/layout/layout.component";

@Component({
    selector: 'app-products',
    standalone: true,
    templateUrl: './productos.component.html',
    styleUrl: './productos.component.css',
    imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, AsyncPipe, CategoriasComponent, LayoutComponent]
})
export class ProductsComponent implements OnInit, OnDestroy {
  
  panelVisible: boolean = false;
  objetoProducto: objetoProducto = new objetoProducto();
  listaCategorias: Categoria[] = [];
  listaProductos: Producto[] = [];
  productoCodigo!: Producto["Codigo_Producto"];
  isEditMode: boolean = false;
  loading: boolean = false;
  
  constructor(private productoServicio: ProductService, errorInterceptor: ErrorInterceptorService) { }
  
  ngOnDestroy(): void {
    // Cleanup if needed
  }

  ngOnInit(): void {
    console.log('ProductsComponent inicializado en ruta admin');
    this.getAllCategorias();
    this.getProductos();
  }

  getAllCategorias() {
    this.productoServicio.getAllCategorias().subscribe({
      next: (res) => {
        this.listaCategorias = res;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.showAlert('Error al cargar categorías', 'error');
      }
    });
  }

   getProductos() {
    this.loading = true;
    this.productoServicio.getProductos().subscribe({
      next: (res) => {
        this.listaProductos = res;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.showAlert('Error al cargar productos', 'error');
        this.loading = false;
      }
    });
  }

 enviarProducto() {
    if (!this.validarFormulario()) {
      this.showAlert('Por favor completa todos los campos obligatorios', 'warning');
      return;
    }

    this.loading = true;
    this.productoServicio.gurdarProducto(this.objetoProducto).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('Respuesta del servidor (crear):', res); // Para debug
        
        // Simplificar como en actualizarProducto - si llega aquí, fue exitoso
        this.showAlert('Producto creado exitosamente', 'success');
        this.getProductos();
        this.cerrarPanelNuevoProducto();
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al crear producto:', error);
        this.showAlert('Error al crear producto', 'error');
      }
    });
}


 onEditarProducto(item: any) {
  if (this.confirmAction('¿Estás seguro de editar este producto?')) {
 
    this.objetoProducto = {
      Codigo_Producto: item.Codigo_Producto,
      Nombre_Producto: item.Nombre_Producto,
      Imagen: item.Imagen,
      Precio: item.Precio,
      Stock: item.Stock,
      Id_Categoria: item.Id_Categoria,
    
    };

    this.isEditMode = true;
    this.panelVisible = true;
    
    console.log('Producto cargado para edición:', this.objetoProducto);
  }
}

  
onEliminarProducto(item: any) {
    if (this.confirmAction('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      this.loading = true;
      this.productoServicio.eliminarProducto(item.Codigo_Producto).subscribe({
        next: (res: any) => {
          this.loading = false;
          console.log('Respuesta del servidor (eliminar):', res); // Para debug
          
          // Simplificar - si llegamos aquí, la eliminación fue exitosa
          this.showAlert('Producto eliminado exitosamente', 'success');
          this.getProductos();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al eliminar producto:', error);
          this.showAlert('Error al eliminar producto', 'error');
        }
      });      
    }
}

 actualizarProducto() {
  if (!this.validarFormulario()) {
    this.showAlert('Por favor completa todos los campos obligatorios', 'warning');
    return;
  }

  if (this.confirmAction('¿Estás seguro de actualizar este producto?')) {
    this.loading = true;

    const codigo = this.objetoProducto.Codigo_Producto;
    
    console.log('Actualizando producto con código:', codigo);
    console.log('Datos a enviar:', this.objetoProducto);

    this.productoServicio.actualizarProducto(codigo, this.objetoProducto).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('Respuesta del servidor:', res); // Para ver qué devuelve realmente
        
        // Simplificar - si llegamos aquí, la actualización fue exitosa
        this.showAlert('Producto actualizado exitosamente', 'success');
        this.getProductos();
        this.cerrarPanelNuevoProducto();
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al actualizar producto:', error);
        this.showAlert('Error al actualizar producto', 'error');
      }
    });
  }
}

  abrirPanelNuevoProducto() {
    this.resetForm();
    this.isEditMode = false;
    this.panelVisible = true;
  }

  cerrarPanelNuevoProducto() {
    this.panelVisible = false;
    this.resetForm();
    this.isEditMode = false;
  }

  resetForm() {
    this.objetoProducto = new objetoProducto();
  }

  validarFormulario(): boolean {
    return !!(
      this.objetoProducto.Codigo_Producto > 0 &&
      this.objetoProducto.Nombre_Producto?.trim() &&
      this.objetoProducto.Precio > 0 &&
      this.objetoProducto.Stock >= 0 &&
      this.objetoProducto.Id_Categoria > 0 &&
      this.objetoProducto.Imagen?.trim()
    );
  }

  confirmAction(message: string): boolean {
    return confirm(message);
  }

  showAlert(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    // Implementar según tu sistema de notificaciones
    // Por ahora usamos alert, pero puedes usar Toast, SweetAlert, etc.
    alert(message);
  }

  getImageUrl(imagen: string): string {
    if (!imagen) return 'assets/images/no-image.png';
    return imagen.startsWith('http') ? imagen : `https://animatiapp.up.railway.app/${imagen}`;
  }

  getCategoryName(categoryId: number): string {
    if (!this.listaCategorias || this.listaCategorias.length === 0) {
      return 'Cargando...';
    }
    const category = this.listaCategorias.find(cat => cat.Id_Categoria === categoryId);
    return category ? category.Nombre_Categoria : 'Sin categoría';
  }

  trackByProductId(index: number, producto: Producto): number {
    return producto.Codigo_Producto;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/no-image.png';
    } 
  } 
}

export class objetoProducto {
  Codigo_Producto: number;
  Id_Categoria: number;
  Nombre_Producto: string;
  Imagen: string;
  Precio: number;
  Stock: number;

  constructor() {
    this.Codigo_Producto = 0;
    this.Nombre_Producto = '';
    this.Imagen = '';
    this.Precio = 0;
    this.Stock = 0;
    this.Id_Categoria = 0;
  }
}