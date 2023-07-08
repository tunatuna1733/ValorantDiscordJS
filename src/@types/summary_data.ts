type MetaDataSummary = {
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

type MatchPlayerSummary = {
  puuid: string;
  name: string;
  tag: string;
  team: string;
  character: string;
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

type MatchSummary = {
  metadata: MetaDataSummary;
  players: {
    red: MatchPlayerSummary[];
    blue: MatchPlayerSummary[];
  };
};
