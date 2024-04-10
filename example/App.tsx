import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";

// or any pure javascript modules available in npm
import { Lrc } from "react-native-lyric";
import useTimer from "./time";
const lrc = `
[00:00.00]Dreamers Dreamers Dreamers Dreamers Dreamers Dreamers Dreamers Dreamers Dreamers Dreamers Dreamers Dreamers Dreamers 
[00:04.43]Jungkook BTS
[00:09.11]
[00:09.61] ....
[00:16.96]Look who we are, we are the dreamers
[00:20.94]We’ll make it happen ’cause we believe it
[00:24.68]Look who we are, we are the dreamers
[00:29.18]We’ll make it happen ’cause we can see it
[00:34.23]Here’s to the ones, that keep the passion
[00:37.69]Respect, oh yeah
[00:41.67]Here’s to the ones, that can imagine
[00:46.20]Respect, oh yeah
[01:07.19]Gather ’round now, look at me
[01:11.71]Respect the love the only way
[01:15.68]If you wanna come, come with me
[01:20.21]The door is open now every day
[01:23.67]This one plus two, rendezvous all at my day
[01:28.19]This what we do, how we do
[01:31.63]Look who we are, we are the dreamers
[01:35.89]We’ll make it happen ’cause we believe it
[01:39.62]Look who we are, we are the dreamers
[01:43.87]We’ll make it happen ’cause we can see it
[01:48.95]Here’s to the ones, that keep the passion
[01:52.44]Respect, oh yeah
[01:56.42]Here’s to the ones, that can imagine
[02:00.67]Respect, oh yeah
[02:22.26]Look who we are, we are the dreamers
[02:25.98]We’ll make it happen ’cause we believe it
[02:30.23]Look who we are, we are the dreamers
[02:33.95]We’ll make it happen ’cause we can see it
[02:38.99]Cause to the one that keep the passion
[02:42.45]Respect, oh yeah
[02:47.22]‘Cause to the one that got the magic
[02:51.21]Respect, oh yeah

`;

export default function App() {
  const { currentMillisecond, setCurrentMillisecond, reset, play, pause } =
    useTimer(1);
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Change code in the editor and watch it change on your phone! Save to get
        a shareable url.
      </Text>
      <Lrc
        lrc={lrc}
        currentTime={currentMillisecond}
        autoScroll
        autoScrollAfterUserScroll={500}
        useMaskedView={true}
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
