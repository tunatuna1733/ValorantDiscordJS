import { Characters } from "./character";

export type RawAccountData = {
  puuid: string;
  region: string;
  account_level: number;
  name: string;
  tag: string;
  card: {
    small: string;
    large: string;
    wide: string;
    id: string;
  };
  last_update: string;
  last_update_raw: number;
};

export type RawMetaData = {
  map: string;
  game_version: string;
  game_length: number;
  game_start: number;
  game_start_patched: string;
  rounds_played: number;
  mode: string;
  mode_id: string;
  queue: string;
  season_id: string;
  platform: string;
  matchid: string;
  premier_info: {
    tournament_id: string;
    matchup_id: string;
  };
  region: string;
  cluster: string;
};

export type RawPlayerData = {
  puuid: string;
  name: string;
  tag: string;
  team: string;
  level: number;
  character: Characters;
  currenttier: number;
  currenttier_patched: string;
  player_card: string;
  player_title: string;
  party_id: string;
  session_playtime: {
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
  assets: {
    card: {
      small: string;
      large: string;
      wide: string;
    };
    agent: {
      small: string;
      full: string;
      bust: string;
      killfeed: string;
    };
  };
  behaviour: {
    afk_rounds: number;
    friendly_fire: {
      incoming: number;
      outgoing: number;
    };
    rounds_in_spawn: number;
  };
  platform: {
    type: string;
    os: {
      name: string;
      version: string;
    };
  };
  ability_casts: {
    c_cast: number;
    q_cast: number;
    e_cast: number;
    x_cast: number;
  };
  stats: {
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    bodyshots: number;
    headshots: number;
    legshots: number;
  };
  economy: {
    spent: {
      overall: number;
      average: number;
    };
    loadout_value: {
      overall: number;
      average: number;
    };
  };
  damage_made: number;
  damage_received: number;
};

export type RawObserverData = {
  puuid: string;
  name: string;
  tag: string;
  platform: {
    type: string;
    os: {
      name: string;
      version: string;
    };
  };
  session_playtime: {
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
  team: string;
  level: number;
  player_card: string;
  player_title: string;
  party_id: string;
};

export type RawTeamData = {
  has_won: boolean;
  rounds_won: number;
  rounds_lost: number;
  roster: {
    members: string[];
    name: string;
    tag: string;
    customization: {
      icon: string;
      image: string;
      primary: string;
      secondary: string;
      tertiary: string;
    };
  };
};

export type RawKillEventInPlayerStats = {
  kill_time_in_round: number;
  kill_time_in_match: number;
  killer_puuid: string;
  killer_display_name: string;
  killer_team: string;
  victim_puuid: string;
  victim_display_name: string;
  victim_team: string;
  victim_death_location: {
    x: number;
    y: number;
  };
  damage_weapon_id: string;
  damage_weapon_name: string;
  damage_weapon_assets: {
    display_icon: string;
    killfeed_icon: string;
  };
  secondary_fire_mode: boolean;
  player_locations_on_kill: {
    player_puuid: string;
    player_display_name: string;
    player_team: string;
    location: {
      x: number;
      y: number;
    };
    view_radians: number;
  }[];
  assistants: {
    assistant_puuid: string;
    assistant_display_name: string;
    assistant_team: string;
  }[];
};

export type RawKills = RawKillEventInPlayerStats & {
  round: number;
};

export type RawRoundData = {
  winning_team: string;
  end_type: string;
  bomb_planted: boolean;
  bomb_defused: boolean;
  plant_events: {
    plant_location: {
      x: number;
      y: number;
    };
    planted_by: {
      puuid: string;
      display_name: string;
      team: string;
    };
    plant_site: string;
    plant_time_in_round: number;
    player_locations_on_plant: {
      player_puuid: string;
      player_display_name: string;
      player_team: string;
      location: {
        x: number;
        y: number;
      };
      view_radians: number;
    }[];
  };
  defuse_events: {
    defuse_location: {
      x: number;
      y: number;
    };
    defused_by: {
      puuid: string;
      display_name: string;
      team: string;
    };
    defuse_time_in_round: number;
    player_locations_on_defuse: {
      player_puuid: string;
      player_display_name: string;
      player_team: string;
      location: {
        x: number;
        y: number;
      };
      view_radians: number;
    }[];
  };
  player_stats: {
    ability_casts: {
      c_cast: number;
      q_cast: number;
      e_cast: number;
      x_cast: number;
    };
    player_puuid: string;
    player_display_name: string;
    player_team: string;
    damage_events: {
      receiver_puuid: string;
      receiver_display_name: string;
      receiver_team: string;
      bodyshots: number;
      headshots: number;
      legshots: number;
      damage: number;
    }[];
    damage: number;
    bodyshots: number;
    headshots: number;
    legshots: number;
    kill_events: RawKillEventInPlayerStats[];
    kills: number;
    score: number;
    economy: {
      loadout_value: number;
      weapon: {
        id: string;
        name: string;
        assets: {
          display_icon: string;
          killfeed_icon: string;
        };
      };
      armor: {
        id: string;
        name: string;
        assets: {
          display_icon: string;
        };
        remaining: number;
        spent: number;
      };
      was_afk: boolean;
      was_penalized: boolean;
      stayed_in_spawn: boolean;
    };
  };
};

export type RawMMRData = {
  currenttier: number;
  currenttier_patched: string;
  images: {
    small: string;
    large: string;
    triangle_down: string;
    triangle_up: string;
  };
  match_id: string;
  map: {
    name: string;
    id: string;
  };
  season_id: string;
  ranking_in_tier: number;
  mmr_change_to_last_game: number;
  elo: number;
  date: string;
  date_raw: number;
};

export type RawMatchData = {
  metadata: RawMetaData;
  players: {
    all_players: RawPlayerData[];
    red: RawPlayerData[];
    blue: RawPlayerData[];
    observers: RawObserverData[];
    coaches: {
      puuid: string;
      team: string;
    }[];
  };
  teams: {
    red: RawTeamData;
    blue: RawTeamData;
  };
  rounds: RawRoundData[];
  kills: RawKills[];
};

export type RawAccountDataResponse = {
  status: number;
  data: RawAccountData;
};

export type RawCurrentRankResponse = {
  status: number;
  data: {
    currenttier: number;
    currenttierpatched: string;
    images: {
      small: string;
      large: string;
      triangle_down: string;
      triangle_up: string;
    };
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    name: string;
    tag: string;
    old: boolean;
  };
};

export type RawMatchDataResponse = {
  status: number;
  data: RawMatchData;
};

export type RawMultipleMatchDataResponse = {
  status: number;
  data: RawMatchData[];
};

export type RawMMRHistoryResponse = {
  status: number;
  name: string;
  tag: string;
  data: RawMMRData[];
};
