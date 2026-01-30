import {Component, ViewChild, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { HTPComponent } from './htp/htp';

@Component({
  selector: 'app-header-buttons',
  imports: [ HTPComponent ],
  templateUrl: './header-buttons.html',
  styleUrl: './header-buttons.css'
})
export class HeaderButtons {
  @Input() open = false;
}
