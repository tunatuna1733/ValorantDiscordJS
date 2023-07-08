import { getMatchDataFromMatchID } from "./utils/fetch";
import { summarizeMatchData } from "./utils/summarize";

const match_data = await getMatchDataFromMatchID(
  "e0e8e524-b605-4ba3-bd9e-f5d4b8c1cef5"
);
const data = summarizeMatchData(match_data.data);
console.dir(data, { depth: null });
