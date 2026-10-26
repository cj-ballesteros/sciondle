
import { Injectable, signal } from '@angular/core';

export interface ExpansionFilter {
    mode: 'all' | 'expansion' | 'range';
    expansion: string;
    startVersion: string;
    endVersion: string;
    includePrevious: boolean;
}

export interface InfiniteSettings {
    races: string[];
    genders: string[];
    affiliations: string[];
    jobs: string[];
    expansionFilter: ExpansionFilter;
    lives: number;
}

export type InfiniteFilterCategory =
    | 'races'
    | 'genders'
    | 'affiliations'
    | 'jobs';

export const DEFAULT_EXPANSION_FILTER: ExpansionFilter = {
    mode: 'all',
    expansion: '2.0',
    startVersion: '2.0',
    endVersion: '7.0',
    includePrevious: true
};

export const DEFAULT_INFINITE_SETTINGS: InfiniteSettings = {
    races: [],
    genders: [],
    affiliations: [],
    jobs: [],
    expansionFilter: { ...DEFAULT_EXPANSION_FILTER },
    lives: 5
};

function copySettings(settings: InfiniteSettings): InfiniteSettings {
    return {
        ...settings,
        races: [...settings.races],
        genders: [...settings.genders],
        affiliations: [...settings.affiliations],
        jobs: [...settings.jobs],
        expansionFilter: { ...settings.expansionFilter }
    };
}

@Injectable({ providedIn: 'root' })
export class InfiniteSettingsService {
    readonly settings = signal<InfiniteSettings>(
        copySettings(DEFAULT_INFINITE_SETTINGS)
    );

    readonly draftSettings = signal<InfiniteSettings>(
        copySettings(DEFAULT_INFINITE_SETTINGS)
    );

    readonly options = signal<Record<InfiniteFilterCategory, string[]>>({
        races: [],
        genders: [],
        affiliations: [],
        jobs: []
    });

    beginEditing(): void {
        this.draftSettings.set(copySettings(this.settings()));
    }

    updateDraftFilter(
        category: InfiniteFilterCategory,
        value: string,
        checked: boolean
    ): void {
        const current = this.draftSettings();
        const selected = current[category];

        this.draftSettings.set({
            ...current,
            [category]: checked
                ? selected.includes(value)
                    ? selected
                    : [...selected, value]
                : selected.filter(item => item !== value)
        });
    }

    updateDraftExpansionFilter(
        updates: Partial<ExpansionFilter>
    ): void {
        this.draftSettings.update(current => ({
            ...current,
            expansionFilter: {
                ...current.expansionFilter,
                ...updates
            }
        }));
    }

    setDraftLives(lives: number): void {
        this.draftSettings.update(current => ({ ...current, lives }));
    }

    resetDraft(): void {
        this.draftSettings.set(copySettings(DEFAULT_INFINITE_SETTINGS));
    }

    confirmDraft(): void {
        this.settings.set(copySettings(this.draftSettings()));
    }

    discardDraft(): void {
        this.beginEditing();
    }

    setOptions(
        options: Record<InfiniteFilterCategory, string[]>
    ): void {
        this.options.set(options);
    }

    setSettings(settings: InfiniteSettings): void {
        this.settings.set(copySettings(settings));
        this.draftSettings.set(copySettings(settings));
    }
}
