import { SlashCommandBuilder, Interaction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register Riot Account.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Enter In-Game Name")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("tag").setDescription("Enter Riot Tag").setRequired(true)
    ),
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === "register") {
      const riot_id = interaction.options.get("id")?.value;
      const riot_tag = interaction.options.get("tag")?.value;
      const discord_id = interaction.user.id;
    }
  },
};
