import { GatewayIntentBits } from "discord.js";
import { SapphireClient } from "@sapphire/framework";
import { Database } from "./utils/database";
import * as dotenv from "dotenv";
import { ImageGeneration } from "./utils/image";
dotenv.config();

const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  loadMessageCommandListeners: true,
});

const db_url =
  typeof process.env["MONGO_URL"] === "string" ? process.env["MONGO_URL"] : "";
export const database = new Database(db_url);
await database.init();
export const image_generation = new ImageGeneration();
await image_generation.init();

client.login(process.env["DISCORD_TOKEN"]);
