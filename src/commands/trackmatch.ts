import { Command } from "@sapphire/framework";
import { database } from "..";
import {
  DatabaseTransactionError,
  UserNotRegisteredError,
  sendErrorInfo,
} from "../utils/error";
import { logCommand } from "../utils/logger";

export class TrackmatchCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Track matches in this channel.",
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
      await interaction.deferReply({ ephemeral: true });
      await logCommand({
        name: "trackmatch",
        executor: {
          id: interaction.user.id,
          name: interaction.user.username,
          guild_name: interaction.guild?.name,
        },
      });
      const discord_id = interaction.user.id;
      const channel_id = interaction.channelId;
      await database.updateTrackMatch(discord_id, true, channel_id);
      await interaction.editReply({
        content:
          "Your competitive match results will be tracked on this channel.",
      });
    } catch (error) {
      await sendErrorInfo(error, TrackmatchCommand.name, {
        name: "trackmatch",
        executor: {
          id: interaction.user.id,
          name: interaction.user.username,
          guild_name: interaction.guild?.name,
        },
      });
      if (error instanceof DatabaseTransactionError) {
        await interaction.editReply({
          content: "Could not fetch data from database. Try again later!",
        });
      } else if (error instanceof UserNotRegisteredError) {
        await interaction.editReply({
          content: "Please register your account first!",
        });
      } else {
        await interaction.editReply({
          content: "Unknown error occurred. Try again later!",
        });
      }
    }
  };
}
