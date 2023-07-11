import { database } from "..";
import {
  DatabaseTransactionError,
  ResourceNotFoundError,
  UnknownAPIError,
} from "./error";
import { getLastCompetitiveMatchFromPUUID } from "./fetch";
import { ScheduledTask } from "@sapphire/plugin-scheduled-tasks";

export class IntervalTask extends ScheduledTask {
  public constructor(
    context: ScheduledTask.Context,
    options: ScheduledTask.Options
  ) {
    super(context, {
      ...options,
      interval: 300_000,
    });
  }

  public run = async () => {
    await this.updateLastMatchInfo();
  };

  private updateLastMatchInfo = async () => {
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
            if (error instanceof ResourceNotFoundError) {
            } else if (error instanceof UnknownAPIError) {
            } else if (error instanceof DatabaseTransactionError) {
            } else {
            }
          }
        });
      })
    );
  };
}
