import { GatewayIntentBits } from "discord.js";
import { SapphireClient, Events } from "@sapphire/framework";
import * as dotenv from "dotenv";
import { Database } from "./utils/database";
import { ImageGeneration } from "./utils/image";
import { updateLastMatchInfo } from "./utils/task";
dotenv.config();

export const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  loadMessageCommandListeners: true,
});

export const log_channel_id =
  typeof process.env["COMMAND_LOG_CHANNEL"] === "string"
    ? process.env["COMMAND_LOG_CHANNEL"]
    : "";
export const error_channel_id =
  typeof process.env["ERROR_LOG_CHANNEL"] === "string"
    ? process.env["ERROR_LOG_CHANNEL"]
    : "";

export const henrik_api_key = process.env["HENRIK_API_KEY"];

const db_url =
  typeof process.env["MONGO_URL"] === "string" ? process.env["MONGO_URL"] : "";
export const database = new Database(db_url);
await database.init();
export const image_generation = new ImageGeneration();
await image_generation.init();

client.once(Events.ClientReady, () => {
  setInterval(() => {
    updateLastMatchInfo();
  }, 300000);
});

client.login(process.env["DISCORD_TOKEN"]);
