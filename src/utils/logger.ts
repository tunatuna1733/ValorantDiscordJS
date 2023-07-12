import { EmbedBuilder } from "discord.js";
import { client, log_channel_id } from "..";

export const logCommand = async (command_info: CommandInfo) => {
  const log_channel = client.channels.cache.get(log_channel_id);
  const desc_text =
    "```" +
    command_info.executor.name +
    ` (${command_info.executor.id})` +
    "\n" +
    command_info.executor.guild_name +
    "```";
  if (typeof log_channel === "undefined" || !log_channel.isTextBased()) return;
  const embed = new EmbedBuilder()
    .setTitle(`${command_info.name}`)
    .setDescription(desc_text);
  await log_channel.send({ embeds: [embed] });
};
