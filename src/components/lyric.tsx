/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useImperativeHandle, useEffect, useMemo } from "react";
import { ScrollView, StyleProp, Text, View, ViewStyle } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";

import { LrcLine, AUTO_SCROLL_AFTER_USER_SCROLL, KaraokeMode, calcKaraokePercentage } from "../constant";
import useLrc from "../util/use_lrc";
import useCurrentIndex from "./use_current_index";
import useLocalAutoScroll from "./use_local_auto_scroll";

interface Props {
  /** lrc string */
  lrc: string;
  /** lrc line render */
  lineRenderer: (props: LineRendererProps) => JSX.Element;
  /** audio currentTime, millisecond */
  currentTime?: number;
  /** whether auto scroll  */
  autoScroll?: boolean;
  /** auto scroll after user scroll */
  autoScrollAfterUserScroll?: number;
  /** when current line change */
  onCurrentLineChange?: ({
    index,
    lrcLine,
  }: {
    index: number;
    lrcLine: LrcLine | null;
  }) => void;
  style: StyleProp<ViewStyle>;
  height: number;
  lineHeight: number;
  activeLineHeight: number;
  noScrollThrottle?: boolean;
  showUnformatted?: boolean;
  onPress?: () => void;
  karaokeOnColor?: string;
  karaokeOffColor?: string;
  karaokeMode?: KaraokeMode;
  [key: string]: any;
}

interface LrcProps {
  scrollToCurrentLine: () => void;
  getCurrentLine: () => {
    index: number;
    lrcLine: LrcLine | null;
  };
}


interface LineRendererProps {
  lrcLine: {content: string};
  active: boolean;
  color?: string;
  index?: number;
  onLayout?: (e: any) => void;
  keyPrefix?: string
}
const defaultLineRenderer = ({ lrcLine: { content }, active, color,onLayout, index, keyPrefix="lyric" }: LineRendererProps) => (
      <Text
        key={`${keyPrefix}.${index}`}
        onLayout={onLayout}
        style={{
          textAlign: "center",
          color,
          fontSize: active ? 16 : 13,
          opacity: active ? 1 : 0.4,
          fontWeight: active ? "500" : "400",
          // width: "100%",
        }}
      >
        {content}
      </Text>
    )

// eslint-disable-next-line no-spaced-func
const Lrc = React.forwardRef<LrcProps, Props>(function Lrc(
  {
    lrc,
    lineRenderer = defaultLineRenderer,
    currentTime = 0,
    autoScroll = true,
    lineHeight = 26,
    activeLineHeight = lineHeight,
    autoScrollAfterUserScroll = AUTO_SCROLL_AFTER_USER_SCROLL,
    onCurrentLineChange,
    height = 500,
    style,
    noScrollThrottle,
    showUnformatted = true,
    onPress,
    karaokeOffColor = "gray",
    karaokeOnColor = "white",
    karaokeMode = KaraokeMode.NoKaraoke,
    ...props
  }: Props,
  ref
) {
  const lrcRef = useRef<ScrollView>(null);
  const locationX = useRef(0);
  const lrcLineList = useLrc(lrc, showUnformatted);
  const scrolled = useRef(false);

  const currentIndex = useCurrentIndex({ lrcLineList, currentTime });
  const { localAutoScroll, resetLocalAutoScroll, onScroll } =
    useLocalAutoScroll({
      autoScroll,
      autoScrollAfterUserScroll,
    });
  const karaokeWidths = useRef<Array<number | undefined>>([undefined]);

  useEffect(() => {
    karaokeWidths.current = [undefined];
  }, [currentIndex])

  // auto scroll
  useEffect(() => {
    if (noScrollThrottle || localAutoScroll) {
      lrcRef.current?.scrollTo({
        y: currentIndex * lineHeight || 0,
        animated: true,
      });
    }
  }, [currentIndex, localAutoScroll, lineHeight]);

  // on current line change
  useEffect(() => {
    onCurrentLineChange?.({
      index: currentIndex,
      lrcLine: lrcLineList[currentIndex] || null,
    });
  }, [lrcLineList, currentIndex, onCurrentLineChange]);

  useImperativeHandle(ref, () => ({
    getCurrentLine: () => ({
      index: currentIndex,
      lrcLine: lrcLineList[currentIndex] || null,
    }),
    scrollToCurrentLine: () => {
      resetLocalAutoScroll();
      lrcRef.current?.scrollTo({
        y: currentIndex * lineHeight || 0,
        animated: true,
      });
    },
  }));

  const calculateKaraokeLrcLineProgress = (lrcLine: LrcLine, index: number) => {
    if (currentIndex === index && lrcLine.duration) {
      return (currentTime - lrcLine.millisecond) / lrcLine.duration;
    } else {
      return 0;
    }
  };

  const realKaraokeLrcLine = (lrcLine: LrcLine, index: number) => {
    return (
    <View
      key={lrcLine.id}
      style={{
        height: activeLineHeight,
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
      }}
    >{
      karaokeWidths.current.includes(undefined) ? 
      lrcLine.karaokeLines?.map((karaokeLine, karaokeIndex) => lineRenderer({
          lrcLine: {content: karaokeLine.content},
          index: karaokeIndex,
          active: true,
          onLayout: (e) => karaokeWidths.current[karaokeIndex] = e.nativeEvent.layout.width,
          keyPrefix: 'karaokeFakeLine',
          color:karaokeOffColor
        }))
       : lrcLine.karaokeLines?.map((karaokeLine, karaokeIndex) => (
        <MaskedView
        key={`${lrcLine.id}.${karaokeIndex}`}
        style={{
          flexDirection: "row",
          height: activeLineHeight,
          width: karaokeWidths.current[karaokeIndex],
        }}
        androidRenderingMode={"software"}
        maskElement={lineRenderer({
          lrcLine: {content: karaokeLine.content},
          index,
          active: true,
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
                width: `${100 - calcKaraokePercentage(currentTime, karaokeLine)}%`,
                backgroundColor: karaokeOffColor,
              }}
            />
      </MaskedView>
      ))
    }
    </View>
  )};

  const karaokeLrcLine = (lrcLine: LrcLine, index: number) => {
    const karaokeProgress = calculateKaraokeLrcLineProgress(lrcLine, index);

    return (
      <MaskedView
        key={lrcLine.id}
        style={{
          flex: 1,
          flexDirection: "row",
          height: activeLineHeight,
        }}
        androidRenderingMode={"software"}
        maskElement={lineRenderer({
          lrcLine,
          index,
          active: true,
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
    );
  };

  const standardLrcLine = (lrcLine: LrcLine, index: number) => (
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
        color: currentIndex === index ? "white" : "gray",
      })}
    </View>
  );

  const lyricNodeList = useMemo(
    () => lrcLineList.map((lrcLine, index) => standardLrcLine(lrcLine, index)),
    [activeLineHeight, currentIndex, lineHeight, lineRenderer, lrcLineList]
  );

  const determineKaraokeMode = (lrcLine: LrcLine, index: number) => {
    if (currentIndex !== index) {
      return standardLrcLine(lrcLine, index);
    }
    switch (karaokeMode) {
      case KaraokeMode.OnlyRealKaraoke:
        return lrcLine.karaokeLines ? realKaraokeLrcLine(lrcLine, index) : standardLrcLine(lrcLine, index)
      case KaraokeMode.FakeKaraoke:
        return karaokeLrcLine(lrcLine, index)
      case KaraokeMode.Karaoke:
        return lrcLine.karaokeLines ? realKaraokeLrcLine(lrcLine, index) : karaokeLrcLine(lrcLine, index)
      case KaraokeMode.NoKaraoke:
      default:
        return standardLrcLine(lrcLine, index);
    }
  }

  return (
    <ScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      ref={lrcRef}
      scrollEventThrottle={30}
      onScroll={onScroll}
      style={[style, { height }]}
      onScrollBeginDrag={() => (scrolled.current = true)}
      onScrollEndDrag={() => (scrolled.current = false)}
      onMomentumScrollEnd={() => (scrolled.current = false)}
      onTouchStart={(e) => (locationX.current = e.nativeEvent.locationX)}
      onTouchEnd={(e) =>
        Math.abs(locationX.current - e.nativeEvent.locationX) < 5 &&
        !scrolled.current &&
        onPress?.()
      }
    >
      <View style={{ flex: 1 }}>
        {autoScroll ? (
          <View style={{ width: "100%", height: 0.45 * height }} />
        ) : null}
        {karaokeMode === KaraokeMode.NoKaraoke
          ? lyricNodeList
          : lrcLineList.map(determineKaraokeMode)}
        {autoScroll ? (
          <View style={{ width: "100%", height: 0.5 * height }} />
        ) : null}
      </View>
    </ScrollView>
  );
});

export default Lrc;
