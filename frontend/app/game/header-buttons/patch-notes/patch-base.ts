export type PatchEntry = {
  version: string;
  date: string;
  summary?: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
};

export const patchNotes: PatchEntry[] = [
  {
    version: "1.0.32",
    date: "2026-03-27",
    summary: "Fix for localstorage and daily reset",
    fixed: [
      "Fixed getting spoiled for the character of the day"
      + "due to localstorage reset not properly aligning"
      + "with the game reset."
    ]
  },
  {
    version: "1.0.31",
    date: "2026-03-17",
    summary: "If randomness doesn't improve with this my family will die. also i promise " +
    "I didn't kill Moenbryda like SE, randomness is a pain. I'm sorry about the hyurs.",
    fixed: [
      "random"
    ]
  },
  {
    version: "1.0.3",
    date: "2026-03-17",
    summary: "Improved responsiveness for most components on the website",
    added: [
      "Added component to show character of yesterday",
    ],
    changed: [
      "Changed time for characters to update daily due to daylight savings"
    ],
    fixed: [
      "Responsiveness for most components when shrinking down the window size/using" +
      " mobile platform has been improved slightly",
    ]
  },
  {
    version: "1.0.21",
    date: "2026-02-21",
    summary: "Heyo, I got some suggestions about the randomness" +
    " of the daily characters. I won't lie, the way it's done" +
    " is a little cooked and I apologize for that. I'll continue to monitor it daily" +
    " and implement a better way to choose a random character" +
    " from the pool. In the meantime, a raid bosses mode is on" +
    " the way, as well as infinite mode, so stay tuned.",
    changed: [
      "Changed Krile version introduction from 2.0 to 3.1",
    ],
    fixed: [
      "Hotfixed randomness",
    ]
  },
  {
    version: "1.0.2",
    date: "2026-02-15",
    summary: "Implemented some much needed changes in this update." +
      " Shout out to WTFDIG, I just copied their google form thing lol.",
    added: [
      "Added header buttons with the How To Play functioning",
      "Created a google form for people to submit feedback to",
      "Implemented patch notes",
      "Colorblind mode implemented in options menu",
    ],
    changed: [
      "Table now displays partial answers for affiliations and jobs",
      "Changed font-family of site to InterVariable",
      "Minor text changes all around",
      "Adjusted share functionality to not give too much away",
      "Colorblind mode also applies to How To Play modal"
    ],
    fixed: [
      "Fixed update time to actually update at 9 PM PST",
      "Modals now close properly if clicking outside of the box"
    ]
  },
  {
    version: "1.0.1",
    date: "2026-01-24",
    summary: "Posted it on reddit this day gulp. A lot of good feedback" +
    " and stuff that I should've had implemented after a month, but was" +
    " on the back burner after getting sick + new savage tier coming out." +
    " Those changes get implemented in the next update, but very" +
    " slowly...",
    added: [
      "Added Zero per request",
      "Made meta changes for search engines."
    ],
    fixed: [
      "Daily character is actually random",
      "Louisoix reorganized and fixed"
    ]
  },
  {
    version: "1.0.0",
    date: "2025-12-14",
    summary: "The release!",
    added: [
      "Implemented a search to guess a daily character",
      "Added major XIV characters into the pool",
      "Created a table to compare guess attributes to the solution",
      "Upon correct guess, display congratulations, tries, and share button",
      "Added footer to plug ko-fi, creator name, copyright",
      "Utilized local storage to remember guesses",
      "Daily character cycles everyday at 9pm PST"
    ],
  }
];
