import { Component, OnInit} from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { ProductService } from '../../services/productoServices/producto.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Producto } from '../../interface/prductolista';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carritoServices/carrito.service';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from '../../services/auth/login.service';

@Component({
    selector: 'app-gallery',
    standalone: true,
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.css',
    imports: [HeaderComponent,CommonModule]
})
export class GalleryComponent implements OnInit{

    listaProductos!: Producto[]
    userLoginOn:boolean=false;
    userLoginOut:boolean=false;
    currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private http:HttpClient, private productoService:ProductService, private carritoService: CarritoService, private loginService: LoginService){
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
                }
            }
        )
    }

    getAllProductos(){
        this.productoService.getProductos().subscribe(res => {
            this.listaProductos = res;
          });
    }

    
    agregarAlCarrito(producto: Producto) {

        this.carritoService.agregarProducto(producto).subscribe({
            next: () => alert('Producto agregado'),
            error: () => alert('No se pudo agregar el producto')
        });
    }

}
