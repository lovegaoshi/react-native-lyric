import { Source } from "./parseHelper";
import parseLrc from "./parseLrc";
import parseKrc from "./parseKrc";
import parseQrc from "./parseQrc";

export default (lrc: string, showUnformatted = true, source?: Source) => {
  switch (source) {
    case Source.Lrc:
      return parseLrc(lrc, showUnformatted);
    case Source.Krc:
      return parseKrc(lrc, showUnformatted);
    default:
      const parsedLrc = [];
      for (const parser of [parseKrc, parseQrc]) {
        const result = parser(lrc, false);
        if (result.length > 0 && (result[0].karaokeLines?.length ?? 0) > 0) return result;
        if (result.length > 0) parsedLrc.push(result);
      }
      return parsedLrc.length > 0
        ? parsedLrc[0]
        : parseLrc(lrc, showUnformatted);
  }
};
