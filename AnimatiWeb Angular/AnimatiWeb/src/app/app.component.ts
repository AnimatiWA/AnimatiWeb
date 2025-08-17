import { Component } from '@angular/core';
import { FooterComponent } from './shared/footer/footer.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { PaginaPrincipalComponent } from './pages/pagina-principal/pagina-principal.component';
import { CommonModule } from '@angular/common';
import { QuienesSomosComponent } from './pages/auth/quienes-somos/quienes-somos.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';
import { UsuarioModule } from './pages/usuario/usuario.module';
import { CarritoModule } from './pages/carrito/carrito.module';
import { InfoBarComponent } from './shared/info-bar/info-bar.component';
import { WhatsappButtonComponent } from './shared/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    QuienesSomosComponent,
    GalleryComponent,
    FooterComponent,
    LoginComponent,
    NavComponent,
    PaginaPrincipalComponent,
    RouterOutlet,
    HttpClientModule,
    UsuarioModule,
    CarritoModule,
    InfoBarComponent,
    WhatsappButtonComponent,
    RouterLink,
  ],
})
export class AppComponent {
  title = 'AnimatiWeb';
}
