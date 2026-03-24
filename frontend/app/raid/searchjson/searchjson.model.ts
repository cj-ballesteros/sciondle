import { matchLevel } from '../../shared/attribute-match';

export interface Boss {
  boss_id: number;
  boss_name: string;
  boss_alias: string;
  expansion: number;
  average_clear_time: string;
  boss_type: string[];
  arena_type: string[];
  encounter_features: string[];
  fundamental_mechanics_featured: string[];
  mechanics_featured: string[];
  image_url: string;
}

export interface GuessResponse {
  guess: Boss;
  answerId: number;
  correct: boolean;
  comparison: {
    boss_name: boolean;
    expansion: boolean;
    average_clear_time: boolean; //'higher' | 'lower' | 'equal';
    boss_type: boolean;
    arena_type: boolean;
    encounter_features: boolean;
    fundamental_mechanics_featured: boolean;
    mechanics_featured: boolean;
  };
}
