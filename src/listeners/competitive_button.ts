import {
  InteractionHandler,
  InteractionHandlerTypes,
  PieceContext,
} from "@sapphire/framework";
import { EmbedBuilder, type ButtonInteraction } from "discord.js";
import { image_generation } from "..";
import { getMatchDataFromMatchID } from "../utils/fetch";
import { summarizeMatchData } from "../utils/summarize";

export class ButtonHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    if (!interaction.customId.startsWith("match.")) return this.none();
    const match_id = interaction.customId.split(".")[1];
    return this.some(match_id);
  }

  public async run(interaction: ButtonInteraction, match_id: string) {
    const match_data = await getMatchDataFromMatchID(match_id);
    const summarized_data = summarizeMatchData(match_data.data);
    const attachment = await image_generation.generateScoreboard(
      summarized_data
    );
    const embed = new EmbedBuilder()
      .setImage(`attachment://${attachment.name}`)
      .setAuthor({
        name: `Match Result`,
        url: `https://tracker.gg/valorant/match/${match_id}`,
      });
    await interaction.reply({
      embeds: [embed],
      files: [attachment],
    });
  }
}
