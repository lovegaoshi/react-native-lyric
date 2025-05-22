import type { LrcLine } from "../../constant";
import getRandomString from "../getRandomString";
import parse from "./parseHelper";

// [此行开始时刻距0时刻的毫秒数,此行持续的毫秒数]<0,此字持续的毫秒数,0>歌<此字开始的时刻距此行开始时刻的毫秒数,此字持续的毫秒数,0>词<此字开始的时刻距此行开始时刻的毫秒数,此字持续的毫秒数,0>正<此字开始的时刻距此行开始时刻的毫秒数,此字持续的毫秒数,0>文

const PrefixTimestampRegex = /\[\d+,\d+\]/;
const KaraokeTimestampRegex = /<(\d+),(\d+),(\d+)>/g;

interface Props {
  lrc: string;
  prefixTimestampRegex: RegExp;
  karaokeTimestampRegex: RegExp;
}

export const generalParser = ({
  lrc,
  prefixTimestampRegex,
  karaokeTimestampRegex,
}: Props): [LrcLine[], string[]] => {
  const lrcLineList: LrcLine[] = [];
  const unformattedLrc: string[] = [];
  const lineList = lrc.split("\n");
  lineList.forEach((line) => {
    const parsedLineTimestamp = line.match(prefixTimestampRegex);
    if (!parsedLineTimestamp) {
      unformattedLrc.push(line);
      return;
    }
    const [millisecond, duration] = JSON.parse(parsedLineTimestamp[0]);
    const karaokeTimestamps = Array.from(line.matchAll(karaokeTimestampRegex));
    const karaokeLines = karaokeTimestamps.map((karaoke, index) => {
      const [_, karaokeStartTime, karaokeDuration] = karaoke;
      const text = line.substring(
        karaoke.index! + karaoke[0].length,
        karaokeTimestamps[index + 1]?.index
      );
      return {
        start: Number(millisecond) + Number(karaokeStartTime),
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
  return [lrcLineList, unformattedLrc];
};

export default (lrc: string, showUnformatted = true): LrcLine[] => {
  const [lrcLineList, unformattedLrc] = generalParser({
    lrc,
    prefixTimestampRegex: PrefixTimestampRegex,
    karaokeTimestampRegex: KaraokeTimestampRegex,
  });
  return parse(lrcLineList, unformattedLrc, showUnformatted);
};
