import { Characters } from "./character";

export type MetaDataSummary = {
  map: string;
  game_length: number;
  game_start: number;
  rounds: number;
  mode: string;
  match_id: string;
  win_team: string;
  score: {
    red: number;
    blue: number;
  };
};

export type MatchPlayerSummary = {
  puuid: string;
  name: string;
  tag: string;
  team: string;
  character: Characters;
  currenttier: number;
  currenttier_patched: string;
  stats: {
    score: number;
    acs: number;
    kills: number;
    deaths: number;
    assists: number;
    bodyshots: number;
    headshots: number;
    legshots: number;
    // calculation needed ==============
    hs_rate: number;
    kd_rate: number;
    kast: number;
    first_bloods: number;
    first_deaths: number;
    econ: number;
    // calculation needed ==============
    damage_made: number;
    damage_received: number;
    money_spent: number;
  };
};

export type MatchSummary = {
  metadata: MetaDataSummary;
  players: MatchPlayerSummary[];
};

export type CompetitiveMatchSummary = {
  character: Characters;
  currenttier: number;
  acs: number;
  kills: number;
  deaths: number;
  assists: number;
  win_lose: string;
  map: string;
  match_id: string;
  score: {
    blue: number;
    red: number;
  };
};
