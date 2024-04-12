import { Source } from "./parseHelper";
import parseLrc from "./parseLrc";
import parseKrc from "./parseKrc";

export default (lrc: string, showUnformatted = true, source?: Source) => {
  switch (source) {
    case Source.Lrc:
      return parseLrc(lrc, showUnformatted);
    case Source.Krc:
      return parseKrc(lrc, showUnformatted);
    default:
      for (const parser of [parseKrc]) {
        const result = parser(lrc, false);
        if (result.length > 0) return result;
      }
      return parseLrc(lrc, showUnformatted);
  }
};
