import {Component, Input, inject} from '@angular/core';
import { GuessResponse } from '../searchjson/searchjson.model';
import { NgClass } from '@angular/common';
import { optionsService } from '../../services/options.service';

@Component({
  selector: 'app-guess-table',
  imports: [ NgClass ],
  templateUrl: './guess-table.html',
  styleUrl: './guess-table.css'
})
export class GuessTableComponent {
  @Input() guesses: GuessResponse[] = [];

  colorblindMode = inject(optionsService);

  // this is really ugly we should change this eventually
  cellBgBinary(g: any){
    const isMatch = g;
    const isColorblind = this.colorblindMode.getMode();

    if (!isMatch) return 'bg-red-200';

    return isColorblind ? 'bg-blue-200' : 'bg-green-200';
  }
  cellBgThree(g: any){
    const isMatch = g;
    const isColorblind = this.colorblindMode.getMode();

    if (isMatch === 'partial') return 'bg-yellow-200';
    else if (isMatch === 'none') return 'bg-red-200';

    return isColorblind ? 'bg-blue-200' : 'bg-green-200';
  }
  cellBgNumeric(g: any){
    const isMatch = g;
    const isColorblind = this.colorblindMode.getMode();

    if (isMatch !== 'equal') return 'bg-red-200';

    return isColorblind ? 'bg-blue-200' : 'bg-green-200';
  }
}
