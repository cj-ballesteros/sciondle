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
