import { matchLevel } from '../../shared/attribute-match';

export interface Character {
  id: number;
  name: string;
  affiliation: string[];
  current_job: string[];
  race: string;
  version_introduction: string;
  image_url: string;
  age: number;
  gender: string;
  job_image_url: string;
}

export interface GuessResponse {
  guess: Character;
  answerId: number;
  correct: boolean;
  comparison: {
    name: boolean;
    affiliation: matchLevel;
    current_job: matchLevel;
    race: boolean;
    version_introduction: 'higher' | 'lower' | 'equal';
    age: 'higher' | 'lower' | 'equal' | 'not_specified';
    gender: boolean;
  };
}
