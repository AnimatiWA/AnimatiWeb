import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [NgIf],
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.css']
})
export class WhatsappButtonComponent implements OnInit {
  isVisible = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const nav = event as NavigationEnd;
        const hiddenRoutes = ['/admin', '/auth/login'];
        this.isVisible = !hiddenRoutes.includes(nav.urlAfterRedirects);
      });
  }
}