// import "./wdyr"; // <--- first import

import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Constants from "expo-constants";
import lrc from "../tests/yrc";

// or any pure javascript modules available in npm
import { Lrc, KaraokeMode } from "react-native-lyric";
import useTimer from "./time";

export default function App() {
  const { currentMillisecond, setCurrentMillisecond, reset, play, pause } =
    useTimer(1);
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>current time: {currentMillisecond}</Text>
      <View style={{ flexDirection: "row", justifyContent: "center", paddingBottom: 20 }}>
        <Button title="reset" onPress={reset} />
        <Button title="play" onPress={play} />
        <Button title="pause" onPress={pause} />
      </View>
      <Lrc
        lrc={lrc}
        currentTime={currentMillisecond}
        autoScroll
        autoScrollAfterUserScroll={500}
        karaokeMode={KaraokeMode.Karaoke}
        onPress={() => console.log('window pressed')}
        onLinePress={console.log}
        activeFontSize={20}
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
