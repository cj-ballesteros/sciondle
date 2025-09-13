import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-header',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
