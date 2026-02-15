import {Component, Input} from '@angular/core';
import { HTPComponent } from './htp/htp';
import { OptionsComponent } from './options/options';

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
