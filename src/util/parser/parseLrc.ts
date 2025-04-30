import type { LrcLine } from "../../constant";
import getRandomString from "../getRandomString";
import parse from "./parseHelper";

const LRC_LINE = /^(\[[0-9]+:[0-9]+(\.[0-9]+)?\])+.*/;
const LRC_TIMESTAMP_WITH_BRACKET = /\[[0-9]+:[0-9]+(\.[0-9]+)?\]/g;
const LRC_TIMESTAMP = /[0-9]+/g;

export default (lrc: string, showUnformatted = true): LrcLine[] => {
  const lrcLineList: LrcLine[] = [];
  const unformattedLrc: string[] = [];
  const lineList = lrc.split("\n");
  for (const line of lineList) {
    if (!LRC_LINE.test(line)) {
      unformattedLrc.push(line);
      continue;
    }
    const timeStringList = line.match(LRC_TIMESTAMP_WITH_BRACKET) as string[];
    const content = line.replace(LRC_TIMESTAMP_WITH_BRACKET, "");
    for (const timeString of timeStringList) {
      const [minute, second, millisecond = "0"] = timeString.match(
        LRC_TIMESTAMP
      ) as string[];
      lrcLineList.push({
        id: getRandomString(),
        millisecond:
          Number.parseInt(minute, 10) * 60 * 1000 +
          Number.parseInt(second, 10) * 1000 +
          Number.parseInt(millisecond, 10),
        content,
      });
    }
  }
  return parse(lrcLineList, unformattedLrc, showUnformatted);
};
