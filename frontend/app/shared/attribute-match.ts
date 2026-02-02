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

export function jobMatch(guessJobs: string[], answerJobs: string[]): matchLevel {
  const g = toSet(guessJobs);
  const a = toSet(answerJobs);

  if (g.size === a.size && [...g].every(x => a.has(x))) return 'exact';

  const overlap = [...g].some(x => a.has(x));
  return overlap ? 'partial' : 'none';
}
