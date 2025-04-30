import "./wdyr"; // <--- first import

import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import lrc from "../tests/qrc";

// or any pure javascript modules available in npm
import { Lrc, KaraokeMode } from "react-native-lyric";
import useTimer from "./time";

export default function App() {
  const { currentMillisecond, setCurrentMillisecond, reset, play, pause } =
    useTimer(1);
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>current time: {currentMillisecond}</Text>
      <Lrc
        lrc={lrc}
        currentTime={currentMillisecond}
        autoScroll
        autoScrollAfterUserScroll={500}
        karaokeMode={KaraokeMode.OnlyRealKaraoke}
        onPress={console.log}
        onLinePress={console.log}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
