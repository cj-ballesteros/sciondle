import { Component, Input, Output, EventEmitter,
  ElementRef, ViewChild, HostListener, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { patchNotes } from './patch-base';

@Component({
  selector: 'app-patch-notes',
  imports: [ CommonModule , A11yModule ],
  templateUrl: './patch-notes.html',
  styleUrl: './patch-notes.css'
})
export class PatchNotes {
  private _open = signal(false);
  patchNotes = patchNotes;

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
}
