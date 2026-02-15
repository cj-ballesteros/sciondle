import {Component, ViewChild, Input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { HTPComponent } from './htp/htp';
import {OptionsComponent} from './options/options';

@Component({
  selector: 'app-header-buttons',
  imports: [HTPComponent, OptionsComponent],
  templateUrl: './header-buttons.html',
  styleUrl: './header-buttons.css'
})
export class HeaderButtons {
  @Input() openOptions = false;
  @Input() openHelp = false;
}
