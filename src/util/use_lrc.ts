import { useMemo } from "react";

import parseLrc from "./parse_lrc";

export default (lrc: string, showUnformatted = true) => {
  const lrcLineList = useMemo(() => parseLrc(lrc, showUnformatted), [lrc]);
  return lrcLineList;
};
