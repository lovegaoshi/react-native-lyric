import { useMemo } from "react";

import parser from "./parser/parser";

export default (lrc: string, showUnformatted = true) => {
  const lrcLineList = useMemo(() => parser(lrc, showUnformatted), [lrc]);
  return lrcLineList;
};
