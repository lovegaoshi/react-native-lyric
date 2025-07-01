import React from "react";
import { Text, Pressable, View } from "react-native";

import type { LrcLine } from "../constant";
import type { LrcCommonProps } from "./LrcProps";

export interface LineRendererProps extends LrcCommonProps {
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
  align = "center",
  fontSize = 14,
  activeFontSize = 16,
  lineHeight,
}: LineRendererProps) => (
  <Text
    key={`${keyPrefix}.${index}`}
    onLayout={onLayout}
    style={{
      lineHeight,
      textAlign: align,
      color,
      fontSize: active ? activeFontSize : fontSize,
      opacity: hidden ? 0 : active ? 1 : 0.8,
      fontWeight: "400", //active ? "500" :
      position: hidden ? "absolute" : undefined,
      // width: "100%",
    }}
  >
    {content}
  </Text>
);

interface StandardLrcLineProps extends LrcCommonProps {
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
  lapsedAsActiveColor?: boolean;
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
  fontScale,
  align = "center",
  fontSize,
  activeFontSize,
  lapsedAsActiveColor,
  lineHeight,
}: StandardLrcLineProps) {
  const isActiveColor = lapsedAsActiveColor
    ? currentIndex >= index
    : currentIndex === index;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: align === "center" ? "center" : undefined,
      }}
      onLayout={onViewLayout}
    >
      <Pressable
        key={lrcLine.id}
        onPress={() => onPress?.(lrcLine)}
        onStartShouldSetResponder={() => true}
      >
        {lineRenderer({
          fontSize,
          activeFontSize,
          align,
          fontScale,
          lrcLine,
          index,
          active: currentIndex === index,
          color: isActiveColor ? karaokeOnColor : karaokeOffColor,
          lineHeight,
        })}
      </Pressable>
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
  // if lapsedAsActiveColor is on, color should be updated on every currentIndex update
  const lapsedColorUpdate =
    newProps.lapsedAsActiveColor &&
    oldProps.currentIndex !== newProps.currentIndex;
  if (lapsedColorUpdate) return false;
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
