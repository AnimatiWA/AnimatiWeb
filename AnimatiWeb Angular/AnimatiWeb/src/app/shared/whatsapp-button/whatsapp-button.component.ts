import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [NgIf],
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.css']
})
export class WhatsappButtonComponent implements OnInit {
  isVisible = true;
  isAdmin = false;

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    // Suscribirse al estado de administrador
    this.loginService.userIsAdmin.subscribe({
      next: (admin) => {
        this.isAdmin = admin;
        this.updateVisibility(this.router.url);
      }
    });

    // Suscribirse a cambios de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const nav = event as NavigationEnd;
        this.updateVisibility(nav.urlAfterRedirects);
      });
  }

  private updateVisibility(currentUrl: string): void {
    const hiddenRoutes = ['/admin', '/auth/login'];
    const isRouteHidden = hiddenRoutes.some(route => currentUrl.startsWith(route));
    this.isVisible = !this.isAdmin && !isRouteHidden;
  }
}