/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useImperativeHandle, useEffect, useMemo } from "react";
import {
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
  Pressable,
} from "react-native";

import {
  LrcLine,
  AUTO_SCROLL_AFTER_USER_SCROLL,
  KaraokeMode,
} from "../constant";
import useLrc from "../util/useLrc";
import useCurrentIndex from "./useCurrentIndex";
import {
  defaultLineRenderer,
  LineRendererProps,
  MemoStandardLine,
} from "./LrcLine";
import { RealKaraokeLrcLine } from "./KLrcLine";
import { FakeKaraokeLrcLine } from "./FakeKLrcLine";
import { execWhenTrue } from "../util/utils";
import type { LrcCommonProps } from "./LrcProps";

interface Props extends LrcCommonProps {
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
  showUnformatted?: boolean;
  onPress?: () => void;
  onLinePress?: (l: LrcLine) => void;
  karaokeOnColor?: string;
  karaokeOffColor?: string;
  karaokeMode?: KaraokeMode;
  lapsedAsActiveColor?: boolean;
  [key: string]: any;
}

interface LrcProps {
  getCurrentLine: () => {
    index: number;
    lrcLine: LrcLine | null;
  };
}

// @ts-expect-error
const Lrc = React.forwardRef<LrcProps, Props>(function Lrc(
  {
    lrc,
    lineRenderer = defaultLineRenderer,
    currentTime = 0,
    autoScroll = true,
    autoScrollAfterUserScroll = AUTO_SCROLL_AFTER_USER_SCROLL,
    onCurrentLineChange,
    height = 500,
    style,
    showUnformatted = true,
    onPress,
    onLinePress,
    karaokeOffColor = "gray",
    karaokeOnColor = "white",
    karaokeMode = KaraokeMode.NoKaraoke,
    fontScale = 1,
    align = "center",
    fontSize = 14,
    activeFontSize = 16,
    lineHeight = fontSize + 12,
    activeLineHeight = activeFontSize + 12,
    lapsedAsActiveColor,
    ...props
  }: Props,
  ref
) {
  lineHeight *= fontScale;
  activeLineHeight *= fontScale;
  fontSize *= fontScale;
  activeFontSize *= fontScale;
  const lrcRef = useRef<ScrollView>(null);
  const lrcLineList = useLrc(lrc, showUnformatted);
  const lrcHeights = useRef<number[]>([]);
  const scrolled = useRef(false);

  const currentIndex = useCurrentIndex({ lrcLineList, currentTime });
  const karaokeWidths = useRef<Array<number | undefined>>([undefined]);

  useEffect(() => {
    karaokeWidths.current = [undefined];
  }, [currentIndex]);

  const scrollToReal = () =>
    lrcRef.current?.scrollTo({
      y: lrcHeights.current[currentIndex] - height / 2,
      animated: true,
    });

  const scrollToFake = () =>
    lrcRef.current?.scrollTo({
      y: currentIndex * lineHeight || 0,
      animated: true,
    });

  // auto scroll
  useEffect(() => {
    if (autoScroll && scrolled.current === false && currentIndex > 0) {
      execWhenTrue({
        loopCheck: async () => lrcHeights.current[currentIndex] !== undefined,
        executeFn: scrollToReal,
        catchFn: scrollToFake,
      });
    }
  }, [currentIndex, lineHeight]);

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
  }));

  const lyricNodeList = useMemo(
    () =>
      lrcLineList.map((lrcLine, index) => (
        <MemoStandardLine
          lapsedAsActiveColor={lapsedAsActiveColor}
          fontSize={fontSize}
          activeFontSize={activeFontSize}
          align={align}
          fontScale={fontScale}
          key={`${lrcLine.id}.standard.${index}`}
          lrcLine={lrcLine}
          index={index}
          currentIndex={currentIndex}
          activeLineHeight={activeLineHeight}
          lineHeight={lineHeight}
          karaokeOnColor={karaokeOnColor}
          karaokeOffColor={karaokeOffColor}
          lineRenderer={lineRenderer}
          onViewLayout={(e) =>
            (lrcHeights.current[index] = e.nativeEvent.layout.y)
          }
        />
      )),
    [activeLineHeight, currentIndex, lineHeight, lineRenderer, lrcLineList]
  );

  const determineKaraokeMode = (lrcLine: LrcLine, index: number) => {
    const defaultLine = () => (
      <MemoStandardLine
        lapsedAsActiveColor={lapsedAsActiveColor}
        fontSize={fontSize}
        activeFontSize={activeFontSize}
        align={align}
        fontScale={fontScale}
        key={`${lrcLine.id}.standard.${index}`}
        lrcLine={lrcLine}
        index={index}
        currentIndex={currentIndex}
        activeLineHeight={activeLineHeight}
        lineHeight={lineHeight}
        karaokeOnColor={karaokeOnColor}
        karaokeOffColor={karaokeOffColor}
        lineRenderer={lineRenderer}
        onViewLayout={(e) =>
          (lrcHeights.current[index] = e.nativeEvent.layout.y)
        }
        onPress={onLinePress}
      />
    );

    const FakeKaraokeLine = () => (
      <FakeKaraokeLrcLine
        fontSize={fontSize}
        activeFontSize={activeFontSize}
        align={align}
        fontScale={fontScale}
        currentIndex={currentIndex}
        currentTime={currentTime}
        index={index}
        lrcLine={lrcLine}
        lrcHeights={lrcHeights}
        activeLineHeight={activeLineHeight}
        lineRenderer={lineRenderer}
        karaokeOffColor={karaokeOffColor}
        karaokeOnColor={karaokeOnColor}
      />
    );

    if (currentIndex !== index) {
      return defaultLine();
    }
    switch (karaokeMode) {
      case KaraokeMode.OnlyRealKaraoke:
        return lrcLine.karaokeLines ? (
          <RealKaraokeLrcLine
            fontSize={fontSize}
            activeFontSize={activeFontSize}
            align={align}
            fontScale={fontScale}
            key={`${lrcLine.id}.real.${index}`}
            currentTime={currentTime}
            lrcLine={lrcLine}
            index={index}
            lineRenderer={lineRenderer}
            activeLineHeight={activeLineHeight}
            karaokeOffColor={karaokeOffColor}
            karaokeOnColor={karaokeOnColor}
            onViewLayout={(e) =>
              (lrcHeights.current[index] = e.nativeEvent.layout.y)
            }
          />
        ) : (
          defaultLine()
        );
      case KaraokeMode.FakeKaraoke:
        return <FakeKaraokeLine />;
      case KaraokeMode.Karaoke:
        return lrcLine.karaokeLines ? (
          <RealKaraokeLrcLine
            fontSize={fontSize}
            activeFontSize={activeFontSize}
            align={align}
            fontScale={fontScale}
            key={`${lrcLine.id}.real.${index}`}
            currentTime={currentTime}
            lrcLine={lrcLine}
            index={index}
            lineRenderer={lineRenderer}
            activeLineHeight={activeLineHeight}
            karaokeOffColor={karaokeOffColor}
            karaokeOnColor={karaokeOnColor}
            onViewLayout={(e) =>
              (lrcHeights.current[index] = e.nativeEvent.layout.y)
            }
          />
        ) : (
          <FakeKaraokeLine />
        );
      case KaraokeMode.NoKaraoke:
      default:
        return defaultLine();
    }
  };

  /**
   * need to investigate wtf is going on.
   * on a scrollTo event, momentumBegin is called; then onScroll; then nothing else.
   * on a scroll vent, scrollBegin is called, then momentumEnd. 
   * if either momentum events are registered, pressable wont work until momentumEnd 
   * emits (via manual scrolling)
   * TODO: retest this in RN 0.79
   * 
      onScrollBeginDrag={(e) => console.log("scroll begin ", e.nativeEvent)}
      onScrollEndDrag={(e) => console.log("scroll end ", e.nativeEvent)}
      onMomentumScrollBegin={(e) =>
        console.log("momentum begin ", e.nativeEvent)
      }
      onMomentumScrollEnd={(e) => console.log("momentum end", e.nativeEvent)}


      onScrollBeginDrag={() => (scrolled.current = true)}
      onScrollEndDrag={() => (scrolled.current = false)}
      onMomentumScrollEnd={() => (scrolled.current = false)}
   */
  return (
    <ScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      ref={lrcRef}
      scrollEventThrottle={30}
      style={[style, { height }]}
    >
      <Pressable style={{ flex: 1 }} onPress={onPress}>
        {autoScroll ? (
          <View style={{ width: "100%", height: 0.45 * height }} />
        ) : null}
        {karaokeMode === KaraokeMode.NoKaraoke
          ? lyricNodeList
          : lrcLineList.map(determineKaraokeMode)}
        {autoScroll ? (
          <View style={{ width: "100%", height: 0.5 * height }} />
        ) : null}
      </Pressable>
    </ScrollView>
  );
});

export default Lrc;
