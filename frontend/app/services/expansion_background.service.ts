import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExpansionBackgroundService {
    private readonly _background = signal<string | null>(null);

    readonly background = this._background.asReadonly();

    setBackground(path: string | null): void {
        this._background.set(path);
    }
}