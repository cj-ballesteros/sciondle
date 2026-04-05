import {Component, Input} from '@angular/core';
import { HTPComponent } from './htp/htp';
import { OptionsComponent } from './options/options';
import {PatchNotes} from './patch-notes/patch-notes';

@Component({
  selector: 'app-header-buttons',
  imports: [HTPComponent, OptionsComponent, PatchNotes],
  templateUrl: './header-buttons.html',
  styleUrl: './header-buttons.css'
})
export class HeaderButtons {
  @Input() openOptions = false;
  @Input() openHelp = false;
  @Input() openPatchNotes = false;
 }
