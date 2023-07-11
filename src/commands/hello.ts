import { Command } from "@sapphire/framework";
import { userMention } from "discord.js";

export class HelloCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Say Hello.",
    });
  }
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("user to say hello")
            .setRequired(true)
        )
    );
  }

  public override chatInputRun(
    interaction: Command.ChatInputCommandInteraction
  ) {
    const user_to_greet = interaction.options.getUser("user", true);
    const user_mention = userMention(user_to_greet.id);

    return interaction.reply({
      content: `Hey ${user_mention}`,
      allowedMentions: {
        users: [user_to_greet.id],
      },
    });
  }
}
