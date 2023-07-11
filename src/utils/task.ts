import { database } from "..";
import { sendErrorInfo } from "./error";
import { getLastCompetitiveMatchFromPUUID } from "./fetch";

export const updateLastMatchInfo = async () => {
  console.log("Updating match ids...");
  const docs = await database.getAllCollections();
  await Promise.all(
    docs.map((doc) => {
      doc.riot_accounts.map(async (riot_account) => {
        try {
          const discord_id = doc.discord_id;
          const puuid = riot_account.puuid;
          const record_match_id = riot_account.last_match_id;
          const { match_id, match_date } =
            await getLastCompetitiveMatchFromPUUID(puuid, "ap");
          if (record_match_id !== match_id) {
            await database.updateMatchInfo(
              discord_id,
              puuid,
              match_id,
              match_date
            );
          }
        } catch (error) {
          await sendErrorInfo(error, updateLastMatchInfo.name);
        }
      });
    })
  );
};
