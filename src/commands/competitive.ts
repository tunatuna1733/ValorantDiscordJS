import { Command } from "@sapphire/framework";
import { logCommand } from "../utils/logger";
import { database } from "..";
import {
  getAccountDataFromPUUID,
  getCompetitiveHistoryFromPUUID,
} from "../utils/fetch";
import { CompetitiveMatchSummary } from "../@types/summary_data";
import { summarizaCompetitiveData } from "../utils/summarize";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { CharacterEmojis } from "../constants/CharacterEmojis";
import {
  sendErrorInfo,
  ResourceNotFoundError,
  UnknownAPIError,
  UserNotRegisteredError,
  DatabaseTransactionError,
} from "../utils/error";
import { ImageGeneration } from "../utils/image";

export class CompetitiveCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Show your recent competitive match results.",
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
      await logCommand({
        name: "competitive",
        executor: {
          id: interaction.user.id,
          name: interaction.user.username,
          guild_name: interaction.guild?.name,
        },
      });
      const discord_id = interaction.user.id;
      const puuid = await database.getPuuidOfLastMatch(discord_id);
      const account_data = await getAccountDataFromPUUID(puuid);
      const match_results = await getCompetitiveHistoryFromPUUID(puuid, "ap");
      let summarized_match_list: CompetitiveMatchSummary[] = [];
      match_results.data.map((match_result) => {
        summarized_match_list.push(
          summarizaCompetitiveData(match_result, puuid)
        );
      });
      const player_name = account_data.data.name;
      const player_tag = account_data.data.tag;
      const player_icon = account_data.data.card.small;
      const embed = new EmbedBuilder().setAuthor({
        name: `${player_name}'s competitive match results`,
        iconURL: player_icon,
        url: `https://tracker.gg/valorant/profile/riot/${player_name}%23${player_tag}/overview`,
      });
      const row = new ActionRowBuilder<ButtonBuilder>();
      summarized_match_list.map((d, i) => {
        const score_text = "```" + d.score.red + " - " + d.score.blue + "```";
        const name_text = `${i + 1}. ${d.map} ${d.win_lose} ${score_text}`;
        const value_text = `  ${
          CharacterEmojis[d.character]
        } ACS: ${d.acs.toFixed(0)} ${d.kills}/${d.deaths}/${d.assists}`;
        embed.addFields([
          {
            name: name_text,
            value: value_text,
            inline: false,
          },
        ]);
        const button_style =
          d.win_lose === "Win" ? ButtonStyle.Success : ButtonStyle.Danger;
        const button = new ButtonBuilder()
          .setCustomId(`match.${d.match_id}.${puuid}`)
          .setLabel(`${i + 1} ${d.map} ${d.win_lose}`)
          .setStyle(button_style);
        row.addComponents(button);
      });
      await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
      await sendErrorInfo(error, CompetitiveCommand.name, {
        name: "competitive",
        executor: {
          id: interaction.user.id,
          name: interaction.user.username,
          guild_name: interaction.guild?.name,
        },
      });
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
