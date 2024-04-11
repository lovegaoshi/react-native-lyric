import { useMemo } from "react";

import parseLrc from "./parser/parseLrc";

export default (lrc: string, showUnformatted = true) => {
  const lrcLineList = useMemo(() => parseLrc(lrc, showUnformatted), [lrc]);
  return lrcLineList;
};
