import React from "react";
import { Text, View } from "react-native";

import { LrcLine } from "../constant";

export interface LineRendererProps {
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

interface StandardLrcLineProps {
  lrcLine: LrcLine;
  index: number;
  currentIndex: number;
  lineRenderer?: (props: LineRendererProps) => JSX.Element;
  activeLineHeight: number;
  lineHeight: number;
  karaokeOnColor: string;
  karaokeOffColor: string;
}
const StandardLrcLine = function standardLrcLine({
  lrcLine,
  index,
  currentIndex,
  activeLineHeight,
  lineHeight,
  karaokeOnColor,
  karaokeOffColor,
  lineRenderer = defaultLineRenderer,
}: StandardLrcLineProps) {
  return (
    <View
      key={lrcLine.id}
      style={{
        height: currentIndex === index ? activeLineHeight : lineHeight,
      }}
    >
      {lineRenderer({
        lrcLine,
        index,
        active: currentIndex === index,
        color: currentIndex === index ? karaokeOnColor : karaokeOffColor,
      })}
    </View>
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
