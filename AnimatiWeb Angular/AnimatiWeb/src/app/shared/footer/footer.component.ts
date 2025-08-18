import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromoModalComponent } from '../promo-modal/promo-modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor(private dialog: MatDialog) {}

  openPromoModal() {
    this.dialog.open(PromoModalComponent, { width: '400px' });
  }
}