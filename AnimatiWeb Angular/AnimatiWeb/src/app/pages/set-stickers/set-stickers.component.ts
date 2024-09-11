import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-set-stickers',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './set-stickers.component.html',
  styleUrl: './set-stickers.component.css'
})
export class SetStickersComponent {

}
