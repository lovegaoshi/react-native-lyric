/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useImperativeHandle, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import {
  LegendList,
  LegendListRef,
  LegendListRenderItemProps,
} from "@legendapp/list/react-native";

import {
  LrcLine,
  AUTO_SCROLL_AFTER_USER_SCROLL,
  KaraokeMode,
} from "../constant";
import useLrc from "../util/useLrc";
import useCurrentIndex from "./useCurrentIndex";
import {
  DefaultLineRenderer,
  LineRendererProps,
  MemoStandardLine,
} from "./LrcLine";
import { RealKaraokeLrcLine } from "./KLrcLine";
import { FakeKaraokeLrcLine } from "./FakeKLrcLine";
import type { LrcCommonProps } from "./LrcProps";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface Props extends LrcCommonProps {
  /** lrc string */
  lrc: string;
  /** lrc line render */
  lineRenderer: (props: LineRendererProps) => React.JSX.Element;
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
  scrollToViewPosition?: number;
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
    lineRenderer = DefaultLineRenderer,
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
    lineHeight = fontSize + 14,
    activeLineHeight = activeFontSize + 14,
    lapsedAsActiveColor,
    scrollToViewPosition = 0.5,
    ...props
  }: Props,
  ref,
) {
  lineHeight *= fontScale;
  activeLineHeight *= fontScale;
  fontSize *= fontScale;
  activeFontSize *= fontScale;
  const lrcRef = useRef<LegendListRef>(null);
  const lrcLineList = useLrc(lrc, showUnformatted);
  const lrcHeights = useRef<number[]>([]);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const renderedOnce = useRef(false);
  const [rendered, setRendered] = useState(false);

  const currentIndex = useCurrentIndex({ lrcLineList, currentTime });
  const karaokeWidths = useRef<Array<number | undefined>>([undefined]);

  useEffect(() => {
    karaokeWidths.current = [undefined];
  }, [currentIndex]);

  // auto scroll: keep the active line vertically centered in the viewport.
  useEffect(() => {
    if (autoScroll) {
      const func = async () =>
        lrcRef.current?.scrollToIndex({
          index: currentIndex,
          animated: true,
          viewPosition: scrollToViewPosition,
        }) ?? setRendered(true);
      func().then(() => func().then(() => setRendered(true)));
    }
  }, [currentIndex, lineHeight, autoScroll, height]);

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

  const renderStandardLine = ({
    item: lrcLine,
    index,
  }: LegendListRenderItemProps<LrcLine>) => (
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
      onViewLayout={(e) => (lrcHeights.current[index] = e.nativeEvent.layout.y)}
    />
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
            activeLineHeight={activeLineHeight}
            fontSize={fontSize}
            activeFontSize={activeFontSize}
            align={align}
            fontScale={fontScale}
            key={`${lrcLine.id}.real.${index}`}
            currentTime={currentTime}
            lrcLine={lrcLine}
            index={index}
            lineRenderer={lineRenderer}
            lineHeight={lineHeight}
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
            lineHeight={lineHeight}
          />
        ) : (
          <FakeKaraokeLine />
        );
      case KaraokeMode.NoKaraoke:
      default:
        return defaultLine();
    }
  };

  const CustomScrollView = (props: ScrollViewProps) => {
    return (
      <ScrollView {...props}>
        <Pressable
          onLayout={(e) => {
            setScrollViewHeight(e.nativeEvent.layout.height);
            if (renderedOnce.current) {
              if (currentIndex === 0 || !autoScroll) {
                setRendered(true);
              }
            } else {
              renderedOnce.current = true;
            }
          }}
          onPress={onPress}
        >
          {props.children}
        </Pressable>
      </ScrollView>
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(rendered ? 1 : 0, { duration: 200 }),
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[{ height }, style]}
        onPress={scrollViewHeight < height ? onPress : undefined}
      >
        <LegendList
          {...props}
          data={lrcLineList}
          renderItem={
            karaokeMode === KaraokeMode.NoKaraoke
              ? renderStandardLine
              : (info: LegendListRenderItemProps<LrcLine>) =>
                  determineKaraokeMode(info.item, info.index)
          }
          keyExtractor={(item: LrcLine) => item.id}
          showsVerticalScrollIndicator={false}
          ref={lrcRef}
          scrollEventThrottle={30}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: autoScroll ? height * 0.45 : 0,
            paddingBottom: autoScroll ? height * 0.5 : 0,
          }}
          estimatedItemSize={lineHeight}
          extraData={currentTime}
          recycleItems={true}
          renderScrollComponent={CustomScrollView}
        />
      </Pressable>
    </Animated.View>
  );
});

export default Lrc;
