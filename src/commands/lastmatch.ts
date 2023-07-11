import { Command } from "@sapphire/framework";
import { EmbedBuilder } from "discord.js";
import { database, image_generation } from "..";
import {
  getAccountDataFromPUUID,
  getLastCompetitiveMatchFromPUUID,
  getMatchDataFromMatchID,
} from "../utils/fetch";
import { summarizeMatchData } from "../utils/summarize";
import {
  DatabaseTransactionError,
  ResourceNotFoundError,
  UnknownAPIError,
  UserNotRegisteredError,
} from "../utils/error";
import { ImageGeneration } from "../utils/image";

export class LastmatchCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Show your last competitive match result.",
    });
  }
  public override registerApplicationCommands = (
    registry: Command.Registry
  ) => {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  };
  public override chatInputRun = async (
    interaction: Command.ChatInputCommandInteraction
  ) => {
    try {
      await interaction.deferReply();
      const discord_id = interaction.user.id;
      const puuid = await database.getPuuidOfLastMatch(discord_id);
      const account_data = await getAccountDataFromPUUID(puuid);
      const { match_id } = await getLastCompetitiveMatchFromPUUID(puuid, "ap");
      const match_data = await getMatchDataFromMatchID(match_id);
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
      interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        await interaction.editReply({
          content: "Could not find match. Try again later!",
        });
      } else if (error instanceof UnknownAPIError) {
        await interaction.editReply({
          content: "Could not fetch match data. Try again later!",
        });
      } else if (error instanceof UserNotRegisteredError) {
        await interaction.editReply({
          content: "Please register your account first!",
        });
      } else if (error instanceof DatabaseTransactionError) {
        await interaction.editReply({
          content: "Could not fetch data from database. Try again later!",
        });
      } else if (error instanceof ImageGeneration) {
        await interaction.editReply({
          content: "Error occurred while generating image. Try again later!",
        });
      } else {
        await interaction.editReply({
          content: "Unknown error occurred. Try again later!",
        });
      }
    }
  };
}
