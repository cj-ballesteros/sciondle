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
        if (this.guesses[i].comparison.name) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.gender) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.age == "equal") {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.affiliation == "exact") {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.current_job == "exact") {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.race) {
          this.shareString += "🟩";
        } else {
          this.shareString += "🟥";
        }
        if (this.guesses[i].comparison.version_introduction == "equal") {
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


