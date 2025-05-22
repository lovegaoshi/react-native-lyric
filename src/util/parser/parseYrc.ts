import type { LrcLine } from "../../constant";
import getRandomString from "../getRandomString";
import parse from "./parseHelper";

// [14400,3600](14400,240,0)At (14640,600,0)break (15240,300,0)of (15540,690,0)day(16230,30,0), (16260,210,0)in (16470,480,0)hope (16950,420,0)we (17370,630,0)rise

const PrefixTimestampRegex = /\[\d+,\d+\]/;
const KaraokeTimestampRegex = /\((\d+),(\d+),(\d+)\)/g;

export default (lrc: string, showUnformatted = true): LrcLine[] => {
  const lrcLineList: LrcLine[] = [];
  const unformattedLrc: string[] = [];
  const lineList = lrc.split("\n");
  lineList.forEach((line) => {
    const parsedLineTimestamp = line.match(PrefixTimestampRegex);
    if (!parsedLineTimestamp) {
      unformattedLrc.push(line);
      return;
    }
    const [millisecond, duration] = JSON.parse(parsedLineTimestamp[0]);
    const karaokeTimestamps = Array.from(line.matchAll(KaraokeTimestampRegex));
    const karaokeLines = karaokeTimestamps.map((karaoke, index) => {
      const [_, karaokeStartTime, karaokeDuration] = karaoke;
      const text = line.substring(
        karaoke.index! + karaoke[0].length,
        karaokeTimestamps[index + 1]?.index
      );
      return {
        start: Number(karaokeStartTime),
        duration: Number(karaokeDuration),
        content: text,
      };
    });
    lrcLineList.push({
      id: getRandomString(),
      millisecond,
      duration,
      content: karaokeLines.reduce((acc, curr) => acc + curr.content, ""),
      karaokeLines,
    });
  });
  return parse(lrcLineList, unformattedLrc, showUnformatted);
};
