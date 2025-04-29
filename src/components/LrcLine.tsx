import React from "react";
import { Text, Pressable } from "react-native";

import type { LrcLine } from "../constant";

export interface LineRendererProps {
  lrcLine: { content: string };
  active: boolean;
  color?: string;
  index?: number;
  onLayout?: (e: any) => void;
  keyPrefix?: string;
  hidden?: boolean;
}

export const defaultLineRenderer = ({
  lrcLine: { content },
  active,
  color,
  onLayout,
  index,
  keyPrefix = "lyric",
  hidden = false,
}: LineRendererProps) => (
  <Text
    key={`${keyPrefix}.${index}`}
    onLayout={onLayout}
    style={{
      paddingVertical: 4,
      textAlign: "center",
      color,
      fontSize: active ? 16 : 14,
      opacity: hidden ? 0 : active ? 1 : 0.8,
      fontWeight: active ? "500" : "400",
      position: hidden ? "absolute" : undefined,
      // width: "100%",
    }}
  >
    {content}
  </Text>
);

interface StandardLrcLineProps {
  lrcLine: LrcLine;
  index: number;
  currentIndex: number;
  lineRenderer?: (props: LineRendererProps) => JSX.Element;
  activeLineHeight: number;
  lineHeight: number;
  karaokeOnColor: string;
  karaokeOffColor: string;
  onViewLayout?: (e: any) => void;
  onPress?: (l: LrcLine) => void;
}
const StandardLrcLine = function standardLrcLine({
  lrcLine,
  index,
  currentIndex,
  karaokeOnColor,
  karaokeOffColor,
  onViewLayout,
  lineRenderer = defaultLineRenderer,
  onPress,
}: StandardLrcLineProps) {
  return (
    <Pressable
      key={lrcLine.id}
      onLayout={onViewLayout}
      onPress={() => onPress?.(lrcLine)}
    >
      {lineRenderer({
        lrcLine,
        index,
        active: currentIndex === index,
        color: currentIndex === index ? karaokeOnColor : karaokeOffColor,
      })}
    </Pressable>
  );
};

const propsEqual = (
  oldProps: StandardLrcLineProps,
  newProps: StandardLrcLineProps
) => {
  const propKeys = Object.keys(oldProps) as unknown as Array<
    keyof StandardLrcLineProps
  >;
  // if all keys other than currentIndex are the same,
  // as well as index === currentIndex does not change,
  // they are the same
  propKeys.splice(propKeys.indexOf("currentIndex"));
  if (
    propKeys.every((key) => oldProps[key] === newProps[key]) &&
    (oldProps.currentIndex === oldProps.index) ===
      (newProps.currentIndex === newProps.index)
  ) {
    return true;
  }
  return false;
};

export const MemoStandardLine = React.memo(StandardLrcLine, propsEqual);
