import { Characters } from "../@types/character";
import { RawKills, RawMatchData } from "../@types/raw_response";
import {
  MetaDataSummary,
  MatchPlayerSummary,
  MatchSummary,
  CompetitiveMatchSummary,
} from "../@types/summary_data";

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
  let all_players_data: MatchPlayerSummary[] = [];
  data.players.all_players.map((player) => {
    const player_data: MatchPlayerSummary = {
      puuid: player.puuid,
      name: player.name,
      tag: player.tag,
      team: player.team,
      character:
        player.character === "KAY/O"
          ? "KAYO"
          : (player.character as Characters),
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
        kd_rate: player.stats.kills / player.stats.deaths,
        kast: calculateKast(data.kills, player.puuid, metadata.rounds),
        first_bloods: calculateFirstBloods(data.kills, player.puuid),
        first_deaths: calculateFirstDeaths(data.kills, player.puuid),
        econ: calculateEcon(player.damage_made, player.economy.spent.overall),
        damage_made: player.damage_made,
        damage_received: player.damage_received,
        money_spent: player.economy.spent.overall,
      },
    };
    all_players_data.push(player_data);
  });
  all_players_data = all_players_data
    .sort((a, b) => (a.stats.acs > b.stats.acs ? -1 : 1))
    .sort((a, b) => (a.team > b.team ? -1 : 1));
  const match_summary: MatchSummary = {
    metadata: metadata,
    players: all_players_data,
  };
  return match_summary;
};

export const summarizaCompetitiveData = (data: RawMatchData, puuid: string) => {
  let player_index = 0;
  let win_lose = "Draw";
  const win_team =
    data.teams.red.has_won === true
      ? "Red"
      : data.teams.blue.has_won === true
      ? "Blue"
      : "Unknown";
  data.players.all_players.map((player, index) => {
    if (player.puuid === puuid) {
      player_index = index;
      if (player.team === win_team) win_lose = "Win";
      else win_lose = "Lose";
    }
  });
  const summarized_data: CompetitiveMatchSummary = {
    character: data.players.all_players[player_index].character,
    currenttier: data.players.all_players[player_index].currenttier,
    acs:
      data.players.all_players[player_index].stats.score /
      data.metadata.rounds_played,
    kills: data.players.all_players[player_index].stats.kills,
    deaths: data.players.all_players[player_index].stats.deaths,
    assists: data.players.all_players[player_index].stats.assists,
    win_lose: win_lose,
    map: data.metadata.map,
  };
  return summarized_data;
};
