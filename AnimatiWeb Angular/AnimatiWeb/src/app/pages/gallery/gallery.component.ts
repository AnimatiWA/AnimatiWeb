import { Component, OnInit} from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { ProductService } from '../../services/productoServices/producto.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Producto } from '../../interface/prductolista';
import { ProductoCarrito } from '../../interface/prductoCarritolista';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carritoServices/carrito.service';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from '../../services/auth/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-gallery',
    standalone: true,
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.css',
    imports: [HeaderComponent, CommonModule, FormsModule]
})
export class GalleryComponent implements OnInit{

    listaProductos!: Producto[]
    productosEnCarrito: ProductoCarrito[] = [];
    userLoginOn:boolean=false;
    userLoginOut:boolean=false;
    currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    productosExpandidos: {[key: number]: boolean} = {}; // Para controlar qué descripciones están expandidas

    constructor(
        private http:HttpClient, 
        private productoService:ProductService, 
        private carritoService: CarritoService, 
        private loginService: LoginService,
        private router: Router
    ){
        this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null); 
     }
    
    ngOnDestroy(): void {
        this.userLoginOut
    }
    
    ngOnInit(): void {
        this.getAllProductos()

        this.loginService.userLoginOn.subscribe({
                next:(userLoginOn) => {
                    this.userLoginOn=userLoginOn;
                    if (userLoginOn) {
                        this.obtenerProductosCarrito();
                    }
                }
            }
        )
        
        this.carritoService.itemsCarrito$.subscribe(items => {
            this.productosEnCarrito = items;
            this.actualizarCantidadesEnGaleria();
        });
    }

    getAllProductos(){
        this.productoService.getProductos().subscribe(res => {
            this.listaProductos = res;
            this.listaProductos.forEach(producto => {
                producto.Cantidad = 1;
            });
          });
    }

    
    agregarAlCarrito(producto: Producto, cantidad: number = 1) {
        if (cantidad < 1) {
            alert('La cantidad debe ser al menos 1');
            return;
        }
        producto.Cantidad = cantidad;

        this.carritoService.agregarProducto(producto).subscribe({
            next: () => alert('Producto agregado'),
            error: (err) => alert(err.error.error)
        });
    }
    
    incrementarCantidad(producto: Producto) {
        if (!producto.Cantidad) {
            producto.Cantidad = 1;
        } else {
            producto.Cantidad += 1;
        }
    }
    
    decrementarCantidad(producto: Producto) {
        if (producto.Cantidad > 1) {
            producto.Cantidad -= 1;
        }
    }
    
    obtenerProductosCarrito() {
        this.carritoService.getProductosCarrito().subscribe(productos => {
            this.productosEnCarrito = productos;
            this.actualizarCantidadesEnGaleria();
        });
    }
    
    actualizarCantidadesEnGaleria() {
        if (this.listaProductos && this.productosEnCarrito) {
            this.listaProductos.forEach(producto => {
                if (!producto.Cantidad) {
                    producto.Cantidad = 1;
                }
                
                const enCarrito = this.productosEnCarrito.find(p => p.Codigo === producto.Codigo_Producto);
                if (enCarrito) {
                    producto.Cantidad = enCarrito.Cantidad;
                }
            });
        }
    }

    /**
     * Maneja el clic en el producto para mostrar/ocultar descripción o redirigir a login
     */
    manejarClicProducto(producto: Producto, event: Event) {
        event.preventDefault(); // Evitar comportamiento por defecto del enlace
        
        if (this.userLoginOn) {
            // Si está logueado, muestra u oculta la descripción
            this.toggleDescripcion(producto);
        } else {
            // Si no está logueado, redirige a login
            this.router.navigate(['/login']);
        }
    }

    /**
     * Muestra u oculta la descripción de un producto
     */
    toggleDescripcion(producto: Producto) {
        if (producto.Codigo_Producto !== undefined) {
            // Si ya existe, lo toggle (invierte valor)
            this.productosExpandidos[producto.Codigo_Producto] = 
                !this.productosExpandidos[producto.Codigo_Producto];
        }
    }

    /**
     * Verifica si un producto tiene su descripción expandida
     */
    esDescripcionVisible(producto: Producto): boolean {
        return producto.Codigo_Producto !== undefined && 
               this.productosExpandidos[producto.Codigo_Producto] === true;
    }
}
