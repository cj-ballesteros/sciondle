export interface Character {
  id: number;
  name: string;
  affiliation: string;
  current_job: string;
  race: string;
  version_introduction: string;
  image_url: string;
}

export interface GuessResponse {
  guess: Character;
  answerId: number;
  comparison: {
    name: boolean;
    affiliation: boolean;
    current_job: boolean;
    race: string;
    version_introduction: boolean;
  };
  correct: boolean;
}
