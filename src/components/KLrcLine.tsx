/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import { View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";

import { LrcLine, calcKaraokePercentage } from "../constant";
import type { LineRendererProps } from "./LrcLine";

interface KareokeProps {
  lrcLine: LrcLine;
  index: number;
  activeLineHeight: number;
  lineRenderer: (props: LineRendererProps) => JSX.Element;
  karaokeOnColor: string;
  karaokeOffColor: string;
  currentTime: number;
  onViewLayout?: (e: any) => void;
}

export const RealKaraokeLrcLine = ({
  lrcLine,
  index,
  activeLineHeight,
  lineRenderer,
  karaokeOnColor,
  karaokeOffColor,
  currentTime,
  onViewLayout,
}: KareokeProps) => {
  const [karaokeWidths, setKaraokeWidths] = useState<Array<number | undefined>>(
    []
  );

  return (
    <View
      onLayout={onViewLayout}
      key={lrcLine.id}
      style={{
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      {lrcLine.karaokeLines?.map((karaokeLine, karaokeIndex) => (
        <MaskedView
          key={`${lrcLine.id}.${karaokeIndex}`}
          style={{
            flexDirection: "row",
            height: activeLineHeight,
            width: karaokeWidths[karaokeIndex] ?? 0,
          }}
          maskElement={lineRenderer({
            lrcLine: { content: karaokeLine.content },
            index,
            active: true,
            color: "white",
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
          lrcLine: { content: karaokeLine.content },
          index: karaokeIndex,
          active: true,
          onLayout: (e) =>
            setKaraokeWidths((v) => {
              v[karaokeIndex] = e?.nativeEvent?.layout?.width;
              return v;
            }),
          keyPrefix: "karaokeFakeLine",
          color: karaokeOffColor,
          hidden: karaokeWidths[0] !== undefined,
        })
      )}
    </View>
  );
};
