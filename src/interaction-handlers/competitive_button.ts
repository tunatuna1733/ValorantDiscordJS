import {
  InteractionHandler,
  InteractionHandlerTypes,
  PieceContext,
} from "@sapphire/framework";
import { EmbedBuilder, type ButtonInteraction } from "discord.js";
import { image_generation } from "..";
import {
  getAccountDataFromPUUID,
  getMatchDataFromMatchID,
} from "../utils/fetch";
import { summarizeMatchData } from "../utils/summarize";

export class ButtonHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override async parse(interaction: ButtonInteraction) {
    if (!interaction.customId.startsWith("match.")) return this.none();
    await interaction.deferReply();
    return this.some(interaction.customId);
  }

  public async run(interaction: ButtonInteraction, custom_id: string) {
    const match_id = custom_id.split(".")[1];
    const puuid = custom_id.split(".")[2];
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
    await interaction.editReply({
      embeds: [embed],
      files: [attachment],
    });
  }
}
