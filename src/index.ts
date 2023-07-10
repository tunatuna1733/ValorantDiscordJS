import { Client, Events, GatewayIntentBits } from "discord.js";
import { data } from "./commands/command_data";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, async (c) => {
  await c.application.commands.set(data);
  console.log(`Bot Ready! Username: ${c.user.tag}`);
});

client.login(process.env["DISCORD_TOKEN"]);
