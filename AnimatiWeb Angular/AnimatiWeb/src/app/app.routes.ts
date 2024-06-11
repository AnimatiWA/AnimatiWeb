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

import { LayoutComponent } from './admin/pages/layout/layout.component';
import { HeaderComponent } from './shared/header/header.component';
import { isLoaddInGuard } from './guards/is-loadd-in.guard';
import { isAdminGuard } from './guards/is-admin.guard';


export const routes: Routes = [
    {path:"gallery", component:GalleryComponent, canActivate: [isLoaddInGuard]},
    {path:"contacto", component:ContactoComponentComponent},
    {path:"cubecraft", component:CubecraftCityComponent},
    {path:"registroUsuarios", component:RegistroDeUsuariosComponent},
    {path:'login', component:LoginComponent},  
    {path:'separadores', component:SeparadoresComponent},
    {path:'set-stickers', component:SetStickersComponent},
    {path:'', component:PaginaPrincipalComponent},
    {path:'Quien-somos', component:QuienesSomosComponent},
    {path: 'dashboard',  component: DashboardComponent},
    {path: 'samplepage', title: 'Sample Page', component: SamplepageComponent},
    {path: 'agregarproductos', component:ProductsComponent, canActivate:[isAdminGuard] },
    {path:'categoria', component:CategoriasComponent},
    
    {path:"", redirectTo:"/", pathMatch:"full"},
    {
        path: '',
        component: LayoutComponent,
        canActivate: [],
        children: [
          {
            path: 'agregarproducto',
            component: ProductsComponent,
            title: 'Products'
          },
          {
            path: 'agregarcategoria',
            component: CategoriasComponent,
            title: 'Category'
          }
        ]
      }
    
];

