import type { LrcLine } from "../../constant";
import getRandomString from "../getRandomString";

export enum Source {
  Lrc = "Lrc",
  Krc = "Krc",
}

export default (
  lrcLineList: LrcLine[],
  unformattedLrc: string[],
  showUnformatted = true
): LrcLine[] => {
  const sortedLrcs = lrcLineList.sort((a, b) => a.millisecond - b.millisecond);
  return showUnformatted && sortedLrcs.length === 0
    ? unformattedLrc.map((content) => ({
        id: getRandomString(),
        millisecond: 0,
        content,
      }))
    : sortedLrcs.map((lrcLine, i) => ({
        ...lrcLine,
        duration: lrcLineList[i + 1]?.millisecond - lrcLine.millisecond,
      }));
};
