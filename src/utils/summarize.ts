export const calculateKast = (
  kills: RawKills[],
  puuid: string,
  rounds: number
) => {
  let rounds_remain = [...Array(rounds)].map((_, i) => i + 1);
  kills.map((kill) => {
    // check for kills
    if (kill.killer_puuid === puuid && rounds_remain.includes(kill.round)) {
      rounds_remain = rounds_remain.filter((i) => i !== kill.round);
    } else {
      // check for assists
      kill.assistants.map((assist) => {
        if (
          assist.assistant_puuid === puuid &&
          rounds_remain.includes(kill.round)
        ) {
          rounds_remain = rounds_remain.filter((i) => i !== kill.round);
        }
      });
    }
  });
  // make sure the length of loop is not changed while the loop is being issued
  let survive_check = [...rounds_remain];
  // check for survival
  survive_check.map((round_number) => {
    let is_killed = false;
    kills.map((kill) => {
      if (kill.round === round_number && kill.victim_puuid === puuid)
        is_killed = true;
    });
    if (!is_killed)
      rounds_remain = rounds_remain.filter((i) => i !== round_number);
  });
  survive_check = [...rounds_remain];
  // check for traded
  survive_check.map((round_number) => {
    let kill_time = 0;
    let killer = "";
    kills.map((kill) => {
      if (kill.round === round_number && kill.victim_puuid === puuid) {
        kill_time = kill.kill_time_in_round;
        killer = kill.killer_puuid;
      }
      if (
        kill.round === round_number &&
        kill_time != 0 &&
        kill.victim_puuid === killer &&
        kill.kill_time_in_round - kill_time < 5000
      ) {
        rounds_remain = rounds_remain.filter((i) => i !== round_number);
      }
    });
  });
  return ((rounds - rounds_remain.length) / rounds) * 100;
};

// todo: this function will stuck if there is a round that no kills occcured
export const calculateFirstBloods = (kills: RawKills[], puuid: string) => {
  let current_round_number = 0;
  let first_bloods = 0;
  kills.map((kill) => {
    if (kill.round === current_round_number) {
      current_round_number++;
      if (kill.killer_puuid === puuid) {
        first_bloods++;
      }
    }
  });
  return first_bloods;
};

export const calculateFirstDeaths = (kills: RawKills[], puuid: string) => {
  let current_round_number = 0;
  let first_deaths = 0;
  kills.map((kill) => {
    if (kill.round === current_round_number) {
      current_round_number++;
      if (kill.victim_puuid === puuid) {
        first_deaths++;
      }
    }
  });
  return first_deaths;
};

export const calculateEcon = (damage_made: number, money_spent: number) => {
  return damage_made / (money_spent / 1000);
};

export const summarizeMatchData = (data: RawMatchData) => {
  const win_team =
    data.teams.red.has_won === true
      ? "Red"
      : data.teams.blue.has_won === true
      ? "Blue"
      : "Unknown";
  // basic info
  const metadata: MetaDataSummary = {
    map: data.metadata.map,
    game_length: data.metadata.game_length,
    game_start: data.metadata.game_start,
    rounds: data.metadata.rounds_played,
    mode: data.metadata.mode,
    match_id: data.metadata.matchid,
    win_team: win_team,
    score: {
      red: data.teams.red.rounds_won,
      blue: data.teams.blue.rounds_won,
    },
  };
  // player info
  let red_players: MatchPlayerSummary[] = [];
  let blue_players: MatchPlayerSummary[] = [];
  data.players.all_players.map((player) => {
    const player_data: MatchPlayerSummary = {
      puuid: player.puuid,
      name: player.name,
      tag: player.tag,
      team: player.team,
      character: player.character,
      currenttier: player.currenttier,
      currenttier_patched: player.currenttier_patched,
      stats: {
        score: player.stats.score,
        acs: player.stats.score / metadata.rounds,
        kills: player.stats.kills,
        deaths: player.stats.deaths,
        assists: player.stats.assists,
        bodyshots: player.stats.bodyshots,
        headshots: player.stats.headshots,
        legshots: player.stats.legshots,
        hs_rate:
          (player.stats.headshots /
            (player.stats.headshots +
              player.stats.bodyshots +
              player.stats.legshots)) *
          100,
        kast: calculateKast(data.kills, player.puuid, metadata.rounds),
        first_bloods: calculateFirstBloods(data.kills, player.puuid),
        first_deaths: calculateFirstDeaths(data.kills, player.puuid),
        econ: calculateEcon(player.damage_made, player.economy.spent.overall),
        damage_made: player.damage_made,
        damage_received: player.damage_received,
        money_spent: player.economy.spent.overall,
      },
    };
    if (player_data.team === "Red") red_players.push(player_data);
    else if (player_data.team === "Blue") blue_players.push(player_data);
  });
  const match_summary: MatchSummary = {
    metadata: metadata,
    players: {
      red: red_players,
      blue: blue_players,
    },
  };
  return match_summary;
};
