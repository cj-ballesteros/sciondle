export type matchLevel = 'none' | 'partial' | 'exact';

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function attributeMatch(guess: string[], answer: string[]): matchLevel {
  const g = new Set((guess ?? []).map(normalize));
  const a = new Set((answer ?? []).map(normalize));

  if (g.size === a.size && [...g].every(x => a.has(x))) return 'exact';

  const overlaps = [...g].some(x => a.has(x));
  return overlaps ? 'partial' : 'none';
}

function toSet(jobs: string[]): Set<string> {
  return new Set((jobs ?? []).filter(Boolean).map(normalize));
}

const classJob: Record<string, string> = {
  'gladiator': 'gladiator_paladin',
  'paladin': 'gladiator_paladin',

  'marauder': 'marauder_warrior',
  'warrior': 'marauder_warrior',

  'pugilist': 'pugilist_monk',
  'monk': 'pugilist_monk',

  'lancer': 'lancer_dragoon',
  'dragoon': 'lancer_dragoon',

  'rogue': 'rogue_ninja',
  'ninja': 'rogue_ninja',

  'archer': 'archer_bard',
  'bard': 'archer_bard',

  'thaumaturge': 'thaumaturge_black_mage',
  'black_mage': 'thaumaturge_black_mage',

  'conjurer': 'conjurer_white_mage',
  'white_mage': 'conjurer_white_mage',

  'arcanist': 'arcanist_smn_sch',
  'summoner': 'arcanist_smn_sch',
  'scholar': 'arcanist_smn_sch',
}

function checkIfJobClass(job:string): string {
  const j = normalize(job);
  return classJob[j] ?? j;
}

export function jobMatch(guessJobs: string[], answerJobs: string[]): matchLevel {
  const g = toSet(guessJobs);
  const a = toSet(answerJobs);

  if (g.size === a.size && [...g].every(x => a.has(x))) return 'exact';

  const directOverlap = [...g].some(x => a.has(x));
  if (directOverlap) return 'partial';

  const gFamilies = new Set([...g].map(checkIfJobClass));
  const aFamilies = new Set([...a].map(checkIfJobClass));
  const familyOverlap = [...gFamilies].some(f => aFamilies.has(f));

  return familyOverlap ? 'partial' : 'none';
}
