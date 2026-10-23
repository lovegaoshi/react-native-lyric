/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import { View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { LrcLine, calcKaraokePercentage } from "../constant";
import type { LineRendererProps } from "./LrcLine";
import type { LrcCommonProps } from "./LrcProps";

interface KareokeProps extends LrcCommonProps {
  lrcLine: LrcLine;
  index: number;
  activeLineHeight: number;
  lineRenderer: (props: LineRendererProps) => React.JSX.Element;
  karaokeOnColor: string;
  karaokeOffColor: string;
  currentTime: number;
  onViewLayout?: (e: any) => void;
}

export const RealKaraokeLrcLine = ({
  lrcLine,
  index,
  lineRenderer,
  karaokeOnColor,
  karaokeOffColor,
  currentTime,
  onViewLayout,
  fontScale,
  align = "center",
  fontSize = 14,
  activeFontSize,
  lineHeight,
  paddingHorizontal = fontSize,
}: KareokeProps) => {
  const [karaokeWidths, setKaraokeWidths] = useState<Array<number | undefined>>(
    [],
  );

  const lrcProps = {
    lineHeight,
    fontSize,
    activeFontSize,
    align,
    fontScale,
    index,
    active: true,
    color: "white",
  };

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
    <Animated.View
      onLayout={onViewLayout}
      key={lrcLine.id}
      style={[
        {
          flexDirection: "row",
          width: "100%",
          justifyContent: align === "center" ? "center" : undefined,
          flexWrap: "wrap",
          alignItems: "flex-start",
          paddingHorizontal,
        },
        animatedStyle,
      ]}
    >
      {lrcLine.karaokeLines?.map((karaokeLine, karaokeIndex) => (
        <MaskedView
          key={`${lrcLine.id}.${karaokeIndex}`}
          style={{
            flexDirection: "row",
            height: lineHeight,
            width: karaokeWidths[karaokeIndex] ?? 0,
          }}
          maskElement={lineRenderer({
            ...lrcProps,
            lrcLine: { content: karaokeLine.content },
          })}
        >
          <View
            style={{
              width: `${calcKaraokePercentage(currentTime, karaokeLine)}%`,
              backgroundColor: karaokeOnColor,
            }}
          />
          <View
            style={{
              width: `${
                100 - calcKaraokePercentage(currentTime, karaokeLine)
              }%`,
              backgroundColor: karaokeOffColor,
            }}
          />
        </MaskedView>
      ))}
      {lrcLine.karaokeLines?.map((karaokeLine, karaokeIndex) =>
        lineRenderer({
          ...lrcProps,
          lrcLine: { content: karaokeLine.content },
          index: karaokeIndex,
          active: true,
          onLayout: (e) => {
            setKaraokeWidths((v) => {
              v[karaokeIndex] = e?.nativeEvent?.layout?.width;
              return v;
            });
          },
          keyPrefix: "karaokeFakeLine",
          color: karaokeOffColor,
          hidden: karaokeWidths[0] !== undefined,
        }),
      )}
    </Animated.View>
  );
};
