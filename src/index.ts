import { getMatchDataFromMatchID } from "./utils/fetch";
import { ImageGeneration } from "./utils/image";
import { summarizeMatchData } from "./utils/summarize";

const match_data = await getMatchDataFromMatchID(
  "e0e8e524-b605-4ba3-bd9e-f5d4b8c1cef5"
);
const data = summarizeMatchData(match_data.data);

const image_generation = new ImageGeneration();
await image_generation.init();
await image_generation.generateScoreboard(data);
