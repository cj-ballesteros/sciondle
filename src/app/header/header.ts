import {Component, ViewChild} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { HTPComponent } from './htp/htp';

@Component({
  selector: 'app-header',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    HTPComponent
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  @ViewChild(HTPComponent) how_to_play!: HTPComponent;

  protected readonly HTPComponent = HTPComponent;

  openHowToPlay() {
    this.how_to_play.toggle();
  }
}
