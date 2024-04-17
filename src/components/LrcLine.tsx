import * as React from "react";
import { Text } from "react-native";

import type { LrcLine } from "../constant";

interface LrcLineProgressProps {
  lrcLine: LrcLine;
  index: number;
  currentIndex: number;
  currentTime: number;
}
export const calculateKaraokeLrcLineProgress = ({
  lrcLine,
  index,
  currentIndex,
  currentTime,
}: LrcLineProgressProps) => {
  if (currentIndex === index && lrcLine.duration) {
    return (currentTime - lrcLine.millisecond) / lrcLine.duration;
  } else {
    return 0;
  }
};

interface LineRendererProps {
  lrcLine: { content: string };
  active: boolean;
  color?: string;
  index?: number;
  onLayout?: (e: any) => void;
  keyPrefix?: string;
}
export const defaultLineRenderer = ({
  lrcLine: { content },
  active,
  color,
  onLayout,
  index,
  keyPrefix = "lyric",
}: LineRendererProps) => (
  <Text
    key={`${keyPrefix}.${index}`}
    onLayout={onLayout}
    style={{
      textAlign: "center",
      color,
      fontSize: active ? 16 : 14,
      opacity: active ? 1 : 0.8,
      fontWeight: active ? "500" : "400",
      // width: "100%",
    }}
    numberOfLines={1}
  >
    {content}
  </Text>
);
