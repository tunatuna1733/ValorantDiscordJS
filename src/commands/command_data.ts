import { ApplicationCommandData } from "discord.js";
export const data: ApplicationCommandData[] = [
  {
    name: "register",
    description: "Register Riot Accout.",
    options[{
      type: 3,
      name: id,
      description: 'Enter In-Game Name',
      required: true
    }]
  },
  {
    name: "lastmatch",
    description: "View last competitive match data.",
  },
  {
    name: "trackmatch",
    description: "Post competitive match results to this channel.",
  },
];
