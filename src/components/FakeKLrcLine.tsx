/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import type { LrcLine } from "../constant";
import type { LineRendererProps } from "./LrcLine";
import type { LrcCommonProps } from "./LrcProps";

interface LrcPositionProps {
  currentIndex: number;
  currentTime: number;
  lrcLine: LrcLine;
  index: number;
}

interface Props extends LrcPositionProps, LrcCommonProps {
  lineRenderer: (props: LineRendererProps) => React.JSX.Element;
  lrcHeights: React.RefObject<number[]>;
  activeLineHeight: number;
  karaokeOnColor: string;
  karaokeOffColor: string;
}

const calculateKaraokeLrcLineProgress = ({
  currentIndex,
  currentTime,
  lrcLine,
  index,
}: LrcPositionProps) => {
  if (currentIndex === index && lrcLine.duration) {
    return (currentTime - lrcLine.millisecond) / lrcLine.duration;
  } else {
    return 0;
  }
};

export const FakeKaraokeLrcLine = ({
  currentIndex,
  currentTime,
  index,
  lrcLine,
  lrcHeights,
  activeLineHeight,
  lineRenderer,
  karaokeOffColor,
  karaokeOnColor,
  fontScale,
  align,
  fontSize = 14,
  activeFontSize,
  lineHeight,
  paddingHorizontal = fontSize,
}: Props) => {
  const karaokeProgress = calculateKaraokeLrcLineProgress({
    currentIndex,
    currentTime,
    lrcLine,
    index,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming((activeFontSize ?? 1.1) / (fontSize ?? 1), {
          duration: 200,
        }),
      },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <MaskedView
        onLayout={(e) => (lrcHeights.current[index] = e.nativeEvent.layout.y)}
        key={lrcLine.id}
        style={{
          flex: 1,
          flexDirection: "row",
          height: activeLineHeight,
          paddingHorizontal,
        }}
        maskElement={lineRenderer({
          fontSize,
          activeFontSize,
          align,
          fontScale,
          lrcLine,
          index,
          active: true,
          lineHeight,
        })}
      >
        {lrcLine.duration ? (
          <>
            <View
              style={{
                width: `${karaokeProgress * 100}%`,
                backgroundColor: karaokeOnColor,
              }}
            />
            <View
              style={{
                width: `${(1 - karaokeProgress) * 100}%`,
                backgroundColor: karaokeOffColor,
              }}
            />
          </>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: karaokeOnColor,
            }}
          />
        )}
      </MaskedView>
    </Animated.View>
  );
};
