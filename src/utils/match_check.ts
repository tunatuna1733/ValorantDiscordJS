import { Database } from "./database";
import { getLastCompetitiveMatchIDFromPUUID } from "./fetch";

export const checkMatchForAllAccounts = async (db_instance: Database) => {
  const data = await db_instance.getAllCollections();
  data.map((user_data) => {
    user_data.riot_accounts.map((riot_account) => {
      const puuid = riot_account.puuid;
      /*const api_match_id = await getLastCompetitiveMatchIDFromPUUID(
        puuid,
        "ap"
      );*/
    });
  });
};
