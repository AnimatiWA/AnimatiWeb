import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromoModalComponent } from '../promo-modal/promo-modal.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(private dialog: MatDialog) {}

  openPromoModal() {
    this.dialog.open(PromoModalComponent, { width: '400px' });
  }
}