import {Component, Input} from '@angular/core';
import {GuessResponse} from '../searchjson/searchjson.model';
import { DatePipe } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-share',
  imports: [ ClipboardModule ],
  templateUrl: './share.html',
  styleUrl: './share.css',
  providers: [ DatePipe ]
})

export class ShareComponent {
  @Input() guesses!: GuessResponse[];
  todayDate = new Date();
  myDate: string | null;
  shareString: string = "";
  showMessage: boolean = false;

  constructor(private datePipe: DatePipe) {
    this.myDate = this.datePipe.transform(this.todayDate, 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.build_share();
  }

  build_share() {
    this.shareString = "XIVdle in " + this.guesses.length;
    if (this.guesses.length == 1) {
      this.shareString += " pull";
    } else {
      this.shareString += " pulls";
    }
    this.shareString += " | " + this.myDate + "\n";
    for (let i = 0; i < this.guesses.length; i++) {
      if (i < 5) {
        if (this.guesses[i].comparison.boss_name) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.expansion) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.average_clear_time) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.boss_type) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.arena_type) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.encounter_features) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.fundamental_mechanics_featured) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.mechanics_featured) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        this.shareString +="\n";
      }
    }
    if (this.guesses.length > 5){
      this.shareString += "+ " + (this.guesses.length - 5) + " more\n";
    }
    this.shareString += "https://xivdle.org/";
  }

  notifyCopy() {
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 2000)
  }
}


