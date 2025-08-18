import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { ContactoComponentComponent } from './pages/contacto-component/contacto-component.component';
import { CubecraftCityComponent } from './pages/cubecraft-city/cubecraft-city.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistroDeUsuariosComponent } from './pages/auth/registro-de-usuarios/registro-de-usuarios.component';
import { SetStickersComponent } from './pages/set-stickers/set-stickers.component';
import { SeparadoresComponent } from './pages/separadores/separadores.component';
import { PaginaPrincipalComponent } from './pages/pagina-principal/pagina-principal.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SamplepageComponent } from './samplepage/samplepage.component';
import { QuienesSomosComponent } from './pages/auth/quienes-somos/quienes-somos.component';
import { ProductsComponent } from './pages/admin/productos/productos.component';
import { CategoriasComponent } from './pages/admin/categorias/categorias.component';
import { CarritoComponent } from './pages/carrito/carrito/carrito.component';
import { ConfirmacionCompraComponent } from './pages/carrito/confirmacion-compra/confirmacion-compra.component';
import { ProcesandoPagoComponent } from './pages/carrito/procesando-pago/procesando-pago.component';
import { PerfilComponent } from './pages/usuario/perfil/perfil.component';
import { LayoutComponent } from './admin/pages/layout/layout.component';
import { HeaderComponent } from './shared/header/header.component';
import { AccesoAdminComponent } from './pages/auth/acceso-admin/acceso-admin.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { HistorialComprasComponent } from './pages/usuario/historial-compras/historial-compras.component';
import { SalesComponent } from './pages/admin/sales/sales.component';
import { ArrepentimientoComponent } from './pages/arrepentimiento/arrepentimiento.component';

export const routes: Routes = [
  // === RUTAS PÚBLICAS ===
  { path: '', component: PaginaPrincipalComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contacto', component: ContactoComponentComponent },
  { path: 'cubecraft', component: CubecraftCityComponent },
  { path: 'separadores', component: SeparadoresComponent },
  { path: 'set-stickers', component: SetStickersComponent },
  { path: 'Quien-somos', component: QuienesSomosComponent },
  { path: 'arrepentimiento', component: ArrepentimientoComponent },
  
  // === RUTAS DE AUTENTICACIÓN ===
  { path: 'login', component: LoginComponent },
  { path: 'registroUsuarios', component: RegistroDeUsuariosComponent },
  { path: 'accesoadmin', component: AccesoAdminComponent },
  { path: 'cambio-contrasena', component: ChangePasswordComponent },
  { path: 'recovery-password', component: RecoveryPasswordComponent },
  
  // === RUTAS DE USUARIO LOGUEADO ===
  { path: 'carrito', component: CarritoComponent },
  { path: 'confirmacion-compra', component: ConfirmacionCompraComponent },
  { path: 'procesando-pago', component: ProcesandoPagoComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'usuario/historial-compras', component: HistorialComprasComponent },
  
  // === RUTAS DE ADMINISTRACIÓN ===
  {
    path: 'admin',
    // canActivate: [AdminGuard], // Descomenta cuando tengas el guard
    children: [
      {
        path: 'productos',
        component: ProductsComponent,
        title: 'Gestión de Productos'
      },
      {
        path: 'categorias',
        component: CategoriasComponent,
        title: 'Gestión de Categorías'
      },
            {
        path: 'sales',
        component: SalesComponent,
        title: 'Resumen de ventas'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard Admin'
      },
      // Redirigir /admin a /admin/productos por defecto
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      }
    ]
  },

  // === RUTAS LEGACY/COMPATIBILIDAD (para no romper enlaces existentes) ===
  // Redirigir rutas antiguas a las nuevas
  { path: 'agregarproductos', redirectTo: 'admin/productos', pathMatch: 'full' },
  { path: 'agregarproducto', redirectTo: 'admin/productos', pathMatch: 'full' },
  { path: 'categoria', redirectTo: 'admin/categorias', pathMatch: 'full' },
  { path: 'agregarcategoria', redirectTo: 'admin/categorias', pathMatch: 'full' },
  { path: 'resumenventas', redirectTo: 'admin/sales', pathMatch: 'full' },
  { path: 'dashboard', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  
  // === RUTAS DE DESARROLLO/TESTING ===
  { path: 'samplepage', title: 'Sample Page', component: SamplepageComponent },

  // === RUTA CATCH-ALL (debe ir al final) ===
  { path: '**', redirectTo: '', pathMatch: 'full' }
];