import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

export const DefaultLineRenderer = ({
  lrcLine: { content },
  active,
  color,
  onLayout,
  index,
  keyPrefix = "lyric",
  hidden = false,
  align = "center",
  fontSize = 14,
  lineHeight,
}: LineRendererProps) => {
  return (
    <Text
      key={`${keyPrefix}.${index}`}
      onLayout={onLayout}
      style={[
        {
          lineHeight,
          textAlign: align,
          color,
          opacity: hidden ? 0 : active ? 1 : 0.8,
          fontWeight: "400", //active ? "500" :
          position: hidden ? "absolute" : undefined,
          // width: "100%",
          fontSize,
        },
      ]}
    >
      {content}
    </Text>
  );
};

interface StandardLrcLineProps extends LrcCommonProps {
  lrcLine: LrcLine;
  index: number;
  currentIndex: number;
  lineRenderer?: (props: LineRendererProps) => React.JSX.Element;
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
  lineRenderer = DefaultLineRenderer,
  onPress,
  fontScale,
  align = "center",
  fontSize = 14,
  activeFontSize,
  lapsedAsActiveColor,
  lineHeight,
  paddingHorizontal = fontSize,
}: StandardLrcLineProps) {
  const isActiveColor = lapsedAsActiveColor
    ? currentIndex >= index
    : currentIndex === index;
  const lrcProps = {
    fontSize,
    activeFontSize,
    currentFontSize: currentIndex === index + 1 ? activeFontSize : fontSize,
    align,
    fontScale,
    lrcLine,
    index,
    active: currentIndex === index,
    color: isActiveColor ? karaokeOnColor : karaokeOffColor,
    lineHeight,
  };

  const scaleRatio = (activeFontSize ?? 1.1) / (fontSize ?? 1);
  const animatedFontSize = useSharedValue(
    currentIndex === index + 1 ? scaleRatio : 1,
  );
  React.useEffect(() => {
    animatedFontSize.value = withTiming(lrcProps.active ? scaleRatio : 1, {
      duration: 200,
    });
  }, [lrcProps.active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedFontSize.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          justifyContent: align === "center" ? "center" : undefined,
          paddingHorizontal,
        },
        animatedStyle,
      ]}
      onLayout={onViewLayout}
    >
      <Pressable
        key={lrcLine.id}
        onPress={() => onPress?.(lrcLine)}
        onStartShouldSetResponder={() => true}
        style={{
          flexDirection: "row",
          justifyContent: align === "center" ? "center" : undefined,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {lrcLine.karaokeLines
          ? lrcLine.karaokeLines.map((karaokeLine, karaokeIndex) =>
              lineRenderer({
                ...lrcProps,
                lrcLine: { content: karaokeLine.content },
                index: karaokeIndex,
              }),
            )
          : lineRenderer(lrcProps)}
      </Pressable>
    </Animated.View>
  );
};

const propsEqual = (
  oldProps: StandardLrcLineProps,
  newProps: StandardLrcLineProps,
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
