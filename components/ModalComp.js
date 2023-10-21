import React, { useEffect, useRef, useState, useCallback } from "react";
import cover from "../assets/coverSong.jpg";
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  PanResponder,
  Image,
  Text,
  ImageBackground,
  Pressable,
} from "react-native";
// import image from "../assets/"
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { debounce } from "lodash";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBackground from "./CustomBackground";

export default function ModalComp({
  windowHeight,
  isBottomSheetOpen,
  handleCloseBottomSheet,
  playSong,
  isPlaying,
  playbackProgress,
  setPlaybackProgress,
  sound,
  duration,
  currentTime,
  currSong,
  togglePlayPause,
  TopSongs1,
  currentIndex,
  setCurrentIndex,
}) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // You can handle drag events here if needed
      },
      onPanResponderRelease: (evt, gestureState) => {
        // You can handle the release event here
        if (gestureState.dy > 50) {
          // You can adjust the threshold for drag opening
          handleCloseBottomSheet();
        }
      },
    })
  ).current;

  const sheetRef = useRef(null);
  const [sheetIsOpen, setSheetIsOpen] = useState(true);

  const snapPoints = ["7%", "100%"];

  const playNextSong = async () => {
    const nextIndex = (currentIndex + 1) % TopSongs1.length;
    await playSong(TopSongs1[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const playPrevSong = async () => {
    let prevIndex = 0;
    if (currentIndex == 0) {
      prevIndex = 0;
    } else {
      prevIndex = (currentIndex - 1 + TopSongs1.length) % TopSongs1.length;
    }
    await playSong(TopSongs1[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  const debouncedUpdateProgress = debounce((value) => {
    setPlaybackProgress(value);
  }, 200);

  const handleListSongs = async (index) => {
    await playSong(TopSongs1[index]);
    setCurrentIndex(index + 1);
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const formattedSeconds = seconds % 60;
    return `${minutes}:${formattedSeconds < 10 ? "0" : ""}${formattedSeconds}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isBottomSheetOpen}
      onRequestClose={handleCloseBottomSheet}
    >
      <LinearGradient colors={["#8BF5FA", "#000"]} style={styles.background}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={[styles.modalContainer]}>
            <View style={styles.bottomSheet} {...panResponder.panHandlers}>
              <View style={styles.imageContainer}>
                <ImageBackground
                  source={currSong ? currSong.imagePath : cover}
                  style={{ width: 290, height: 290 }}
                />
              </View>
              <View>
                <Text style={styles.songTitle}>
                  {currSong ? currSong.title : ""}
                </Text>
                <Text style={styles.songArtist}>
                  {currSong ? currSong.artist : ""}
                </Text>
              </View>

              <View>
                <Slider
                  style={styles.progessBar}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="blue"
                  maximumTrackTintColor="black"
                  thumbTintColor="blue"
                  value={playbackProgress}
                  onSlidingStart={() => {
                    if (isPlaying) {
                      sound.pauseAsync();
                    }
                  }}
                  onValueChange={(value) => {
                    debouncedUpdateProgress(value);
                  }}
                  onSlidingComplete={async (value) => {
                    if (sound) {
                      const newPosition = value * duration;
                      await sound.setPositionAsync(newPosition);
                      if (isPlaying) {
                        sound.playAsync();
                      }
                    }
                  }}
                />

                <View style={styles.durationContainer}>
                  <Text style={styles.currentTime}>
                    {formatTime(currentTime)}
                  </Text>
                  <Text style={styles.currentTime}>{formatTime(duration)}</Text>
                </View>
              </View>

              <View style={styles.controlContainer}>
                <TouchableOpacity onPress={playPrevSong}>
                  <MaterialIcons color="white" name="skip-previous" size={32} />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlayPause}>
                  {isPlaying ? (
                    <AntDesign name="pause" size={32} color="white" />
                  ) : (
                    <AntDesign name="play" size={32} color="white" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={playNextSong}>
                  <MaterialIcons color="white" name="skip-next" size={32} />
                </TouchableOpacity>
              </View>
            </View>

            <BottomSheet
              ref={sheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose={false}
              // style={{ backgroundColor: 'red' }}
              backgroundComponent={CustomBackground}
              // onClose={() => setSheetIsOpen(false)}
            >
              <BottomSheetView style={{ paddingTop: 50 }}>
                {TopSongs1.map((eachSong, id) => {
                  return (
                    <Pressable
                      onPress={() => {
                        handleListSongs(id);
                      }}
                      key={id}
                      style={{
                        height: 60,
                        flexDirection: "row",
                        paddingHorizontal: 20,
                        alignItems: "center",
                        gap: 20,
                        backgroundColor:
                          id === currentIndex - 1 ? "purple" : "transparent",
                      }}
                    >
                      <ImageBackground
                        source={eachSong.imagePath}
                        style={{ width: 45, height: 45 }}
                      />
                      <Text>{eachSong.title}</Text>
                    </Pressable>
                  );
                })}
              </BottomSheetView>
            </BottomSheet>
          </View>
        </GestureHandlerRootView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    paddingTop: 50,
    // padding: -15,
  },
  modalContainer: {
    // flex: 1,
    // justifyContent: "flex-end",
  },
  bottomSheet: {
    // backgroundColor: "yellow",
    // borderTopLeftRadius: 10,
    height: "100%",
    // borderTopRightRadius: 10,
    alignItems: "center",
    paddingVertical: 23,
    paddingHorizontal: 25,
  },
  currentTime: {
    color: "white",
  },
  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 25,
    borderWidth: 4,
    borderColor: "blue",
  },
  songTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "white",
  },
  songArtist: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    color: "white",
    opacity: 0.7,
  },
  progessBar: {
    width: 320,
    marginTop: 25,
    height: 40,
  },
  durationContainer: {
    width: 320,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controlContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 25,
  },
});
