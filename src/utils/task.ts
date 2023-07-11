import { EmbedBuilder } from "discord.js";
import { client, database, image_generation } from "..";
import { sendErrorInfo } from "./error";
import {
  getAccountDataFromPUUID,
  getLastCompetitiveMatchFromPUUID,
  getMatchDataFromMatchID,
} from "./fetch";
import { summarizeMatchData } from "./summarize";

export const updateLastMatchInfo = async () => {
  console.log("Updating match ids...");
  const docs = await database.getAllCollections();
  docs.map((doc) => {
    Promise.all(
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
            if (doc.track_match) {
              await sendImageToChannel(puuid, match_id, doc.track_channel);
            }
          }
        } catch (error) {
          await sendErrorInfo(error, updateLastMatchInfo.name);
        }
      })
    );
  });
};

export const sendImageToChannel = async (
  puuid: string,
  match_id: string,
  channel_id: string
) => {
  try {
    const match_data = await getMatchDataFromMatchID(match_id);
    const account_data = await getAccountDataFromPUUID(puuid);
    const summarized_data = summarizeMatchData(match_data.data);
    const attachment = await image_generation.generateScoreboard(
      summarized_data
    );
    let team = "";
    let embed_color = 0xeeeeee;
    let win_lose = "Draw";
    const player_icon = account_data.data.card.small;
    const player_name = account_data.data.name;
    const score_text = `${summarized_data.metadata.score.red} - ${summarized_data.metadata.score.blue}`;
    const game_length = (summarized_data.metadata.game_length / 60)
      .toFixed(0)
      .toString();
    summarized_data.players.map((player) => {
      if (player.puuid === puuid) {
        team = player.team;
      }
    });
    if (summarized_data.metadata.win_team === team) {
      embed_color = 0x33ff33;
      win_lose = "Win";
    } else if (summarized_data.metadata.win_team !== team) {
      embed_color = 0xff2222;
      win_lose = "Lose";
    }
    const embed = new EmbedBuilder()
      .setColor(embed_color)
      .setImage(`attachment://${attachment.name}`)
      .setAuthor({
        name: `${player_name}'s last match result`,
        iconURL: player_icon,
        url: `https://tracker.gg/valorant/match/${match_id}`,
      })
      .setTitle(
        `${win_lose} ` + "```" + score_text + "```" + ` (${game_length}mins)`
      );
    const channel = client.channels.cache.get(channel_id);
    if (typeof channel === "undefined" || !channel?.isTextBased()) return;
    await channel.send({ embeds: [embed], files: [attachment] });
  } catch (error) {
    await sendErrorInfo(error, sendImageToChannel.name);
  }
};
