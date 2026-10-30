import { Component, Input, Output, EventEmitter,
  ElementRef, ViewChild, HostListener, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { optionsService } from '../../../services/options.service';
import { FormsModule } from '@angular/forms';
import {
  InfiniteSettingsService,
  type InfiniteSettings,
  type InfiniteFilterCategory,
  type ExpansionFilter
} from '../../../services/infinite-settings.service';
import { ExpansionBackgroundService } from '../../../services/expansion_background.service';

@Component({
  selector: 'app-options',
  imports: [ CommonModule , A11yModule, FormsModule ],
  templateUrl: './options.html',
  styleUrl: './options.css',
})
export class OptionsComponent {
  colorblindMode = inject(optionsService);
  private _open = signal(false);
  private readonly backgroundService = inject(ExpansionBackgroundService);
  @Input() infiniteMode = false;

  @Input() set open(v: boolean) {
    const next = !!v;

    if (next && !this._open()) {
      this.infiniteService.beginEditing();
    }

    this._open.set(next);
  }
  get open() { return this._open(); }

  @Output() openChange = new EventEmitter<boolean>();

  @Output() settingsConfirmed = new EventEmitter<InfiniteSettings>();

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

  close(): void {
    if (this.infiniteMode) {
      this.infiniteService.discardDraft();
    }

    this.openChange.emit(false);
  }

  readonly infiniteService = inject(InfiniteSettingsService);

  get infiniteSettings() {
    return this.infiniteService.draftSettings();
  }

  get raceOptions() {
    return this.infiniteService.options().races;
  }

  get genderOptions() {
    return this.infiniteService.options().genders;
  }

  get affiliationOptions() {
    return this.infiniteService.options().affiliations;
  }

  get jobOptions() {
    return this.infiniteService.options().jobs;
  }

  onLivesChange(value: string): void {
    this.infiniteService.setDraftLives(Number(value));
  }

  onFilterChange(
      category: InfiniteFilterCategory,
      value: string,
      checked: boolean
  ): void {
    this.infiniteService.updateDraftFilter(category, value, checked);
  }

  resetInfiniteSettings(): void {
    this.infiniteService.resetDraft();
  }

  confirmInfiniteSettings(): void {
    this.infiniteService.confirmDraft();

    const selectedVersion =
        this.infiniteService.settings().expansionFilter.expansion;

    const selectedExpansion = this.expansionChoices.find(
        expansion => expansion.version === selectedVersion
    );

    this.backgroundService.setBackground(
        selectedExpansion?.background ?? null
    );

    this.settingsConfirmed.emit(this.infiniteService.settings());
    this.openChange.emit(false);
  }

  onExpansionFilterChange(
      updates: Partial<ExpansionFilter>
  ): void {
    this.infiniteService.updateDraftExpansionFilter(updates);
  }

  toggleRole(roleJobs: string[]): void {
    const selectedJobs = this.infiniteSettings.jobs;
    const allSelected = roleJobs.every(job =>
        selectedJobs.includes(job)
    );

    if (allSelected) {
      this.infiniteSettings.jobs = selectedJobs.filter(
          job => !roleJobs.includes(job)
      );
    } else {
      this.infiniteSettings.jobs = [
        ...new Set([...selectedJobs, ...roleJobs])
      ];
    }
  }

  readonly versionChoices: string[] = [
    '2.0', '2.1', '2.2', '2.3', '2.4', '2.5', '2.55',
    '3.0', '3.1', '3.2', '3.3', '3.4', '3.5', '3.55',
    '4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.55',
    '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.55',
    '6.0', '6.1', '6.2', '6.3', '6.4', '6.5', '6.55',
    '7.0', '7.1', '7.2', '7.3', '7.4', '7.5', '7.55'
  ];

  openVersionDropdown: 'start' | 'end' | null = null;

  startVersionSearch = '';
  endVersionSearch = '';

  get filteredStartVersions(): string[] {
    const search = this.startVersionSearch.trim();
    return this.versionChoices.filter(version => version.includes(search));
  }

  get filteredEndVersions(): string[] {
    const search = this.endVersionSearch.trim();
    return this.versionChoices.filter(version => version.includes(search));
  }

  toggleVersionDropdown(type: 'start' | 'end'): void {
    this.openVersionDropdown =
        this.openVersionDropdown === type ? null : type;
  }

  selectVersion(type: 'start' | 'end', version: string): void {
    if (type === 'start') {
      this.onExpansionFilterChange({ startVersion: version });
      this.startVersionSearch = '';
    } else {
      this.onExpansionFilterChange({ endVersion: version });
      this.endVersionSearch = '';
    }

    this.openVersionDropdown = null;
  }

  get selectedExpansionBackground(): string {
    const selectedVersion =
        this.infiniteSettings.expansionFilter.expansion;

    return this.expansionChoices.find(
        expansion => expansion.version === selectedVersion
    )?.background ?? '';
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open) this.close();
  }

  roleGroups = [
    {
      name: 'Tank',
      icon: 'paladin',
      jobs: ['paladin', 'warrior', 'dark_knight', 'gunbreaker']
    },
    {
      name: 'Healer',
      icon: 'white_mage',
      jobs: ['white_mage', 'scholar', 'astrologian', 'sage']
    },
    {
      name: 'Melee DPS',
      icon: 'monk',
      jobs: [
        'monk', 'dragoon', 'ninja', 'samurai',
        'reaper', 'viper'
      ]
    },
    {
      name: 'Physical Ranged DPS',
      icon: 'bard',
      jobs: ['bard', 'machinist', 'dancer']
    },
    {
      name: 'Magical Ranged DPS',
      icon: 'black_mage',
      jobs: [
        'black_mage', 'summoner', 'red_mage',
        'pictomancer', 'blue_mage'
      ]
    }
  ];

  readonly expansionChoices = [
    {
      name: 'A Realm Reborn',
      version: '2.0',
      image: 'expansion_logos/a_realm_reborn_logo.png',
      background: 'a_realm_reborn_poster.jpg'
    },
    {
      name: 'Heavensward',
      version: '3.0',
      image: 'expansion_logos/heavensward_logo.png',
      background: 'heavensward_poster.jpg'

    },
    {
      name: 'Stormblood',
      version: '4.0',
      image: 'expansion_logos/stormblood_logo.png',
      background: 'stormblood_poster.jpg'
    },
    {
      name: 'Shadowbringers',
      version: '5.0',
      image: 'expansion_logos/shadowbringers_logo.png',
      background: 'shadowbringers_poster.jpg'
    },
    {
      name: 'Endwalker',
      version: '6.0',
      image: 'expansion_logos/endwalker_logo.png',
      background: 'endwalker_poster.jpg'
    },
    {
      name: 'Dawntrail',
      version: '7.0',
      image: 'expansion_logos/dawntrail_logo.png',
      background: 'dawntrail_poster.jpg'
    }
  ];
  protected readonly optionsService = optionsService;

}
