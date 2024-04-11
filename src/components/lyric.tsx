/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useImperativeHandle, useEffect, useMemo } from "react";
import { ScrollView, StyleProp, Text, View, ViewStyle } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";

import { LrcLine, AUTO_SCROLL_AFTER_USER_SCROLL } from "../constant";
import useLrc from "../util/use_lrc";
import useCurrentIndex from "./use_current_index";
import useLocalAutoScroll from "./use_local_auto_scroll";

interface Props {
  /** lrc string */
  lrc: string;
  /** lrc line render */
  lineRenderer: ({
    lrcLine,
    index,
    active,
    color,
  }: {
    lrcLine: LrcLine;
    index: number;
    active: boolean;
    color?: string;
  }) => JSX.Element;
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
  useMaskedView?: boolean;
  [key: string]: any;
}

interface LrcProps {
  scrollToCurrentLine: () => void;
  getCurrentLine: () => {
    index: number;
    lrcLine: LrcLine | null;
  };
}
// eslint-disable-next-line no-spaced-func
const Lrc = React.forwardRef<LrcProps, Props>(function Lrc(
  {
    lrc,
    lineRenderer = ({ lrcLine: { content }, active, color }) => (
      <Text
        style={{
          flex: 1,
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
    ),
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
    useMaskedView = false,
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
    onCurrentLineChange &&
      onCurrentLineChange({
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

  const maskedLrcLine = (lrcLine: LrcLine, index: number) => {
    return (
      <MaskedView
        key={lrcLine.id}
        style={{
          flex: 1,
          flexDirection: "row",
          height: currentIndex === index ? activeLineHeight : lineHeight,
        }}
        androidRenderingMode={"software"}
        maskElement={lineRenderer({
          lrcLine,
          index,
          active: currentIndex === index,
        })}
      >
        {currentIndex !== index ? (
          <View
            style={{
              flex: 1,
              backgroundColor: "gray",
            }}
          />
        ) : lrcLine.duration ? (
          <>
            <View
              style={{
                width: `${
                  ((currentTime - lrcLine.millisecond) / lrcLine.duration) * 100
                }%`,
                backgroundColor: "white",
              }}
            />
            <View
              style={{
                width: `${
                  (1 - (currentTime - lrcLine.millisecond) / lrcLine.duration) *
                  100
                }%`,
                backgroundColor: "gray",
              }}
            />
          </>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
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
    () =>
      lrcLineList.map((lrcLine, index) =>
        useMaskedView
          ? maskedLrcLine(lrcLine, index)
          : standardLrcLine(lrcLine, index)
      ),
    [activeLineHeight, currentIndex, lineHeight, lineRenderer, lrcLineList]
  );
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
        {lyricNodeList}
        {autoScroll ? (
          <View style={{ width: "100%", height: 0.5 * height }} />
        ) : null}
      </View>
    </ScrollView>
  );
});

export default Lrc;
