import type { LrcLine } from "../../constant";
import parse from "./parseHelper";
import { generalParser } from "./parseKrc";

// [14400,3600](14400,240,0)At (14640,600,0)break (15240,300,0)of (15540,690,0)day(16230,30,0), (16260,210,0)in (16470,480,0)hope (16950,420,0)we (17370,630,0)rise

const PrefixTimestampRegex = /\[\d+,\d+\]/;
const KaraokeTimestampRegex = /\((\d+),(\d+),(\d+)\)/g;

export default (lrc: string, showUnformatted = true): LrcLine[] => {
  const [lrcLineList, unformattedLrc] = generalParser({
    lrc,
    prefixTimestampRegex: PrefixTimestampRegex,
    karaokeTimestampRegex: KaraokeTimestampRegex,
  });
  return parse(lrcLineList, unformattedLrc, showUnformatted);
};
