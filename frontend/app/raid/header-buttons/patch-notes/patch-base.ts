export interface PatchEntry {
  name: string;
  text: string;
  highlight: string;
  former?: string;
}

export interface PatchNote {
  date: string;
  tags: string[];
  entries: PatchEntry[];
}
