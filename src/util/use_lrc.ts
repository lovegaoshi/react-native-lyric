import { useMemo } from "react";

import parser from "./parser/parser";

export default (lrc: string, showUnformatted = true, useWhite = false) => {
  const lrcLineList = useMemo(() => {
    const result = parser(lrc, showUnformatted);
    if (useWhite) return [{white: 0}, ...result, { white: 1 }];
    return result;
  }, [lrc, useWhite]);
  
  return lrcLineList;
};
