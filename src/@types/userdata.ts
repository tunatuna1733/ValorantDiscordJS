type RiotAccountData = {
  id: string;
  tag: string;
  puuid: string;
  last_match_id: string;
  match_date: number;
};

type UserData = {
  discord_id: string;
  track_match: boolean;
  track_channel: string;
  riot_accounts: RiotAccountData[];
};
