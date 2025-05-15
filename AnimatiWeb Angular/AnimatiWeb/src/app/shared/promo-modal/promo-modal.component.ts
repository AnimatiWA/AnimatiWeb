import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-promo-modal',
  templateUrl: './promo-modal.component.html',
  styleUrl: './promo-modal.component.css'
})
export class PromoModalComponent {
  constructor(private dialogRef: MatDialogRef<PromoModalComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }
}
