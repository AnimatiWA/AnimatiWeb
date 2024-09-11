import { Component, OnInit} from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { ProductService } from '../../services/productoServices/producto.service';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../interface/prductolista';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-gallery',
    standalone: true,
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.css',
    imports: [HeaderComponent,CommonModule]
})
export class GalleryComponent implements OnInit{

    listaProductos!: Producto[]
    constructor(private http:HttpClient, private productoService:ProductService){ }
    
    
    ngOnInit(): void {
        this.getAllProductos()
    }

    getAllProductos(){
        this.productoService.getProductos().subscribe(res => {
            this.listaProductos = res;
          });
    }

    
    agregarAlCarrito(producto:Producto) {
    
        return this.productoService.agregarProductoCarrito(producto);
    
    }

        
}
