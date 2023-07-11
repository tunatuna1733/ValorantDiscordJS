import { Command } from "@sapphire/framework";
import { database } from "..";
import {
  getAccountDataFromNameTag,
  getLastCompetitiveMatchFromPUUID,
} from "../utils/fetch";
import {
  DatabaseTransactionError,
  ResourceNotFoundError,
  UnknownAPIError,
} from "../utils/error";

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
      await interaction.deferReply();
      const discord_id = interaction.user.id;
      const riot_id = interaction.options.getString("id", true);
      const riot_tag = interaction.options.getString("tag", true);
      const puuid_res = await getAccountDataFromNameTag(riot_id, riot_tag);
      const puuid = puuid_res.data.puuid;
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
        await interaction.editReply({
          content: "register done",
        });
      } catch (error) {
        if (error instanceof DatabaseTransactionError) {
          await interaction.editReply({
            content: `Could not update databse record. Try again later!\nDatabase ERROR: ${error.message}`,
          });
        } else {
          await interaction.editReply({
            content: "Unknown error occurred. Try again later!",
          });
        }
      }
    } catch (error) {
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
