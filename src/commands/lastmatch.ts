import { Command } from "@sapphire/framework";
import { EmbedBuilder } from "discord.js";
import { database, image_generation } from "..";
import {
  getLastCompetitiveMatchFromPUUID,
  getMatchDataFromMatchID,
} from "../utils/fetch";
import { summarizeMatchData } from "../utils/summarize";
import {
  DatabaseTransactionError,
  ResourceNotFoundError,
  UnknownAPIError,
  UserNotRegistered,
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
      const { match_id } = await getLastCompetitiveMatchFromPUUID(puuid, "ap");
      const match_data = await getMatchDataFromMatchID(match_id);
      const summarized_data = summarizeMatchData(match_data.data);
      const attachment = await image_generation.generateScoreboard(
        summarized_data
      );
      let team = "";
      let embed_color = 0xeeeeee;
      summarized_data.players.map((player) => {
        if (player.puuid === puuid) {
          team = player.team;
        }
      });
      if (summarized_data.metadata.win_team === team) {
        embed_color = 0x33ff33;
      } else if (summarized_data.metadata.win_team !== team) {
        embed_color = 0xff2222;
      }
      const embed = new EmbedBuilder()
        .setColor(embed_color)
        .setImage(`attachment://${attachment.name}`);
      interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        await interaction.editReply({
          content: "",
        });
      } else if (error instanceof UnknownAPIError) {
        await interaction.editReply({
          content: "",
        });
      } else if (error instanceof UserNotRegistered) {
        await interaction.editReply({
          content: "",
        });
      } else if (error instanceof DatabaseTransactionError) {
        await interaction.editReply({
          content: "",
        });
      } else if (error instanceof ImageGeneration) {
        await interaction.editReply({
          content: "",
        });
      } else {
        await interaction.editReply({
          content: "",
        });
      }
    }
  };
}
