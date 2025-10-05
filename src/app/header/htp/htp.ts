import { Component } from '@angular/core';

@Component({
  selector: 'app-htp',
  imports: [],
  templateUrl: './htp.html',
  styleUrl: './htp.css'
})
export class HTPComponent {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
