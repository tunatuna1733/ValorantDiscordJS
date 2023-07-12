import { Command } from "@sapphire/framework";
import { EmbedBuilder } from "discord.js";
import { database } from "..";
import {
  getAccountDataFromNameTag,
  getCurrentRankFromPUUID,
  getLastCompetitiveMatchFromPUUID,
} from "../utils/fetch";
import {
  DatabaseTransactionError,
  DuplicateRiotAccountError,
  ResourceNotFoundError,
  UnknownAPIError,
  sendErrorInfo,
} from "../utils/error";
import { logCommand } from "../utils/logger";

export class RegisterCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Register Riot Account.",
    });
  }
  public override registerApplicationCommands = (
    registry: Command.Registry
  ) => {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Enter In-Game Name")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("tag")
            .setDescription("Enter Riot Tag")
            .setRequired(true)
        )
    );
  };
  public override chatInputRun = async (
    interaction: Command.ChatInputCommandInteraction
  ) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      await logCommand({
        name: "register",
        executor: {
          id: interaction.user.id,
          name: interaction.user.username,
          guild_name: interaction.guild?.name,
        },
      });
      const discord_id = interaction.user.id;
      const riot_id = interaction.options.getString("id", true);
      const riot_tag = interaction.options.getString("tag", true);
      const account_data = await getAccountDataFromNameTag(riot_id, riot_tag);
      const puuid = account_data.data.puuid;
      const current_rank_data = await getCurrentRankFromPUUID(puuid, "ap");
      const { match_id, match_date } = await getLastCompetitiveMatchFromPUUID(
        puuid,
        "ap"
      );
      const riot_account: RiotAccountData = {
        id: riot_id,
        tag: riot_tag,
        puuid: puuid,
        last_match_id: match_id,
        match_date: match_date,
      };
      try {
        await database.upsertUser(discord_id, riot_account);
        const embed = new EmbedBuilder()
          .setAuthor({ name: "Register succeeded!" })
          .setTitle(`${riot_id}#${riot_tag}`)
          .setDescription(`Rank: ${current_rank_data.data.currenttierpatched}`)
          .setThumbnail(account_data.data.card.small);
        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        await sendErrorInfo(error, RegisterCommand.name, {
          name: "register",
          executor: {
            id: interaction.user.id,
            name: interaction.user.username,
            guild_name: interaction.guild?.name,
          },
        });
        if (error instanceof DatabaseTransactionError) {
          await interaction.editReply({
            content: `Could not update databse record. Try again later!\nDatabase ERROR: ${error.message}`,
          });
        } else if (error instanceof DuplicateRiotAccountError) {
          await interaction.editReply({
            content: "This account is already registered!",
          });
        } else {
          await interaction.editReply({
            content: "Unknown error occurred. Try again later!",
          });
        }
      }
    } catch (error) {
      await sendErrorInfo(
        error,
        RegisterCommand.name,
        {
          name: "register",
          executor: {
            id: interaction.user.id,
            name: interaction.user.username,
            guild_name: interaction.guild?.name,
          },
        },
        `id: ${interaction.options.getString(
          "id",
          true
        )}, tag: ${interaction.options.getString("tag", true)}`
      );
      if (error instanceof ResourceNotFoundError) {
        await interaction.editReply({
          content: "Account Not Found!",
        });
      } else if (error instanceof UnknownAPIError) {
        await interaction.editReply({
          content: `Unknown error occurred. Try again later!\nAPI ERROR: ${error.message}`,
        });
      } else {
        await interaction.editReply({
          content: "Unknown error occurred. Try again later!",
        });
      }
    }
  };
}
