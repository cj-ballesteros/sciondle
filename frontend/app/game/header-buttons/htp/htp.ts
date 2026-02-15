import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
  effect,
  signal,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import {optionsService} from '../../../services/options.service';

@Component({
  selector: 'app-htp',
  imports: [ CommonModule , A11yModule ],
  templateUrl: './htp.html',
  styleUrl: './htp.css',
})
export class HTPComponent {
  colorblindMode = inject(optionsService);

  private _open = signal(false);

  @Input() set open(v: boolean) { this._open.set(!!v); }
  get open() { return this._open(); }

  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('panel') panelRef?: ElementRef<HTMLElement>;
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const isOpen = this._open();
      if (isOpen) {
        this.previouslyFocused = document.activeElement as HTMLElement;
      } else {
        queueMicrotask(() => this.previouslyFocused?.focus?.());
        this.previouslyFocused = null;
      }
    });
  }

  close() {
    this.openChange.emit(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open) this.close();
  }

  bgIsColorblind () {
    if (this.colorblindMode.getMode()) {
      return 'bg-blue-200';
    } else return 'bg-green-200';
  }
  textIsColorblind () {
    if (this.colorblindMode.getMode()) {
      return 'text-blue-200';
    } else return 'bg-green-200';
  }
}
