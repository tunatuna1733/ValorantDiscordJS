import { Command } from "@sapphire/framework";
import { logCommand } from "../utils/logger";
import { database } from "..";
import { getCompetitiveHistoryFromPUUID } from "../utils/fetch";
import { CompetitiveMatchSummary } from "../@types/summary_data";
import { summarizaCompetitiveData } from "../utils/summarize";

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
      const match_results = await getCompetitiveHistoryFromPUUID(puuid, "ap");
      let summarized_match_list: CompetitiveMatchSummary[] = [];
      match_results.data.map((match_result) => {
        summarized_match_list.push(
          summarizaCompetitiveData(match_result, puuid)
        );
      });
    } catch (error) {}
  };
}
