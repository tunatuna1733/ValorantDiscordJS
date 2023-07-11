import { Image, createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import * as promises from "fs/promises";
import * as fs from "fs";
import { AttachmentBuilder } from "discord.js";
import { MatchSummary } from "../@types/summary_data";
import { CharacterImage } from "../@types/character";

export class ImageGeneration {
  character_images: CharacterImage;
  rank_images: Image[] = [];
  public init = async () => {
    this.character_images = {
      Gekko: await loadImage(
        `https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png`
      ),
      Fade: await loadImage(
        `https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png`
      ),
      Breach: await loadImage(
        `https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png`
      ),
      Deadlock: await loadImage(
        `https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/displayicon.png`
      ),
      Raze: await loadImage(
        `https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png`
      ),
      Chamber: await loadImage(
        `https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/displayicon.png`
      ),
      KAYO: await loadImage(
        `https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png`
      ),
      Skye: await loadImage(
        `https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png`
      ),
      Cypher: await loadImage(
        `https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png`
      ),
      Sova: await loadImage(
        `https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png`
      ),
      Killjoy: await loadImage(
        `https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png`
      ),
      Harbor: await loadImage(
        `https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png`
      ),
      Viper: await loadImage(
        `https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png`
      ),
      Phoenix: await loadImage(
        `https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png`
      ),
      Astra: await loadImage(
        `https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/displayicon.png`
      ),
      Brimstone: await loadImage(
        `https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png`
      ),
      Neon: await loadImage(
        `https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png`
      ),
      Yoru: await loadImage(
        `https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png`
      ),
      Sage: await loadImage(
        `https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png`
      ),
      Reyna: await loadImage(
        `https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png`
      ),
      Omen: await loadImage(
        `https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png`
      ),
      Jett: await loadImage(
        `https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png`
      ),
    };
    for (let i = 0; i <= 27; i++) {
      if (i === 1 || i === 2) continue;
      const rank_image = await loadImage(
        `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${i}/largeicon.png`
      );
      this.rank_images.push(rank_image);
    }
    GlobalFonts.registerFromPath(
      "assets/font/NotoSansJP-Regular.otf",
      "NotoSans"
    );
  };

  public generateScoreboard = async (data: MatchSummary) => {
    const file_name = `${data.metadata.match_id}.png`;
    if (!fs.existsSync(`tmp/${file_name}`)) {
      const scoreboard_name =
        data.metadata.win_team === "Red" ? "scoreboard1" : "scoreboard2";
      const canvas = createCanvas(1920, 1080);
      const context = canvas.getContext("2d");
      context.font = "48px NotoSans";
      context.fillStyle = "#ffffff";
      // draw background map image and scoreboard
      const map_image = await loadImage(`assets/map/${data.metadata.map}.png`);
      const scoreboard_image = await loadImage(
        `assets/scoreboard/${scoreboard_name}.png`
      );
      const additive_x = (canvas.width - scoreboard_image.width) / 2;
      const additive_y = (canvas.height - scoreboard_image.height) / 2;
      context.drawImage(map_image, 0, 0, canvas.width, canvas.height);
      context.drawImage(scoreboard_image, additive_x, additive_y);
      // draw player stats
      // some variables of coordinates
      const character_x = 10 + additive_x;
      const name_x = character_x + 80;
      const rank_x = 475 + additive_x;
      const acs_x = rank_x + 90;
      const kills_x = rank_x + 195;
      const deaths_x = rank_x + 290;
      const assists_x = rank_x + 430;
      const kd_x = rank_x + 530;
      const hs_x = rank_x + 630;
      const econ_x = rank_x + 725;
      const kast_x = rank_x + 830;
      const fb_x = rank_x + 940;
      const fd_x = rank_x + 1010;
      let coord_y = 42 + additive_y; // index y coordinate
      const character_icon_width = 74;
      const character_icon_height = 74;
      const rank_icon_width = 64;
      const rank_icon_height = 64;
      const text_y_additive = 50;
      const players_y = 74; // height of each player's stats row
      const between_players_y = 5; // height of player divider
      const between_teams_y = 42; // height of team divider
      data.players.map((player, i) => {
        // draw character icon and rank icon
        const character = this.character_images[player.character];
        const rank = this.rank_images[player.currenttier];
        context.drawImage(
          character,
          character_x,
          coord_y,
          character_icon_width,
          character_icon_height
        );
        context.drawImage(
          rank,
          rank_x + 5,
          coord_y + 5,
          rank_icon_width,
          rank_icon_height
        );
        // draw info
        context.fillText(
          player.name,
          name_x,
          coord_y + text_y_additive,
          rank_x - name_x
        );
        if (player.stats.acs.toFixed(0).toString().length === 2) {
          context.fillText(
            " " + player.stats.acs.toFixed(0).toString(),
            acs_x,
            coord_y + text_y_additive
          );
        } else {
          context.fillText(
            player.stats.acs.toFixed(0).toString(),
            acs_x,
            coord_y + text_y_additive
          );
        }
        if (player.stats.kills.toString().length === 1) {
          context.fillText(
            " " + player.stats.kills.toString(),
            kills_x,
            coord_y + text_y_additive
          );
        } else {
          context.fillText(
            player.stats.kills.toString(),
            kills_x,
            coord_y + text_y_additive
          );
        }
        if (player.stats.deaths.toString().length === 1) {
          context.fillText(
            " " + player.stats.deaths.toString(),
            deaths_x,
            coord_y + text_y_additive
          );
        } else {
          context.fillText(
            player.stats.deaths.toString(),
            deaths_x,
            coord_y + text_y_additive
          );
        }
        if (player.stats.assists.toString().length === 1) {
          context.fillText(
            " " + player.stats.assists.toString(),
            assists_x,
            coord_y + text_y_additive
          );
        } else {
          context.fillText(
            player.stats.assists.toString(),
            assists_x,
            coord_y + text_y_additive
          );
        }
        context.fillText(
          player.stats.kd_rate.toFixed(1).toString(),
          kd_x,
          coord_y + text_y_additive
        );
        if (player.stats.hs_rate.toFixed(0).toString().length === 1) {
          context.fillText(
            " " + player.stats.hs_rate.toFixed(0).toString(),
            hs_x,
            coord_y + text_y_additive
          );
        } else {
          context.fillText(
            player.stats.hs_rate.toFixed(0).toString(),
            hs_x,
            coord_y + text_y_additive
          );
        }
        if (player.stats.econ.toFixed(0).toString().length === 3) {
          context.fillText(
            player.stats.econ.toFixed(0).toString(),
            econ_x - 5,
            coord_y + text_y_additive
          );
        } else {
          context.fillText(
            player.stats.econ.toFixed(0).toString(),
            econ_x,
            coord_y + text_y_additive
          );
        }
        context.fillText(
          player.stats.kast.toFixed(0).toString(),
          kast_x,
          coord_y + text_y_additive
        );
        context.fillText(
          player.stats.first_bloods.toString(),
          fb_x,
          coord_y + text_y_additive
        );
        context.fillText(
          player.stats.first_deaths.toString(),
          fd_x,
          coord_y + text_y_additive
        );
        coord_y += players_y + between_players_y;
        if (i === 4) {
          coord_y += between_teams_y - between_players_y;
        }
      });
      // finally return discord attachment instance
      // for debug at this time
      const canvas_data = await canvas.encode("png");
      await promises.writeFile(`tmp/${file_name}`, canvas_data);
    }
    const attachment = new AttachmentBuilder(`tmp/${file_name}`, {
      name: file_name,
    });
    return attachment;
  };
}
