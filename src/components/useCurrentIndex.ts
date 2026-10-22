import { useState, useEffect } from "react";

import type { LrcLine } from "../constant";

export default ({
  lrcLineList,
  currentTime,
}: {
  lrcLineList: LrcLine[];
  currentTime: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    if (currentTime === -1) {
      return setCurrentIndex(-1);
    }
    const { length } = lrcLineList;
    let i = 0;
    for (; i < length; i += 1) {
      const { millisecond } = lrcLineList[i];
      if (currentTime < millisecond) {
        break;
      }
    }
    setCurrentIndex(i - 1);
  }, [currentTime, lrcLineList]);

  return currentIndex;
};
