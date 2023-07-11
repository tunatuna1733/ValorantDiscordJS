import { EmbedBuilder } from "discord.js";
import { client, error_channel_id } from "..";

export class UnknownError extends Error {
  constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}
export class ResourceNotFoundError extends Error {}
export class UnknownAPIError extends UnknownError {}
export class UserNotRegisteredError extends Error {}
export class DuplicateRiotAccountError extends Error {}
export class DatabaseTransactionError extends Error {
  constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}
export class ImageGenerationError extends Error {}

// this function should be called in the catch block of the caller's try-catch
export const sendErrorInfo = async (
  error: Error,
  where: string,
  command_info?: CommandInfo
) => {
  const error_channel = client.channels.cache.get(error_channel_id);
  if (typeof error_channel === "undefined" || !error_channel.isTextBased())
    return;
  const embed = new EmbedBuilder().setTitle(
    `${error.name} occurred in ${where}`
  );
  if (command_info) {
    embed.addFields([
      {
        name: `Command: ${command_info.name}`,
        value: `By: ${command_info.executor.name} (id: ${command_info.executor.id})\nIn: ${command_info.executor.guild_name}`,
      },
    ]);
  }
  await error_channel.send({ embeds: [embed] });
};
