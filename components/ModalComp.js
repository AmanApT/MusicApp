import React, { useRef } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  PanResponder,
  Image,
  Text,
} from "react-native";
// import image from "../assets/"
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

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
      <View style={[styles.modalContainer]}>
        <View style={styles.bottomSheet} {...panResponder.panHandlers}>
          <View style={styles.imageContainer}>
            <Text style={{ color: "black" }}>Hello</Text>
          </View>
          <View>
            <Text style={styles.songTitle}>Apna Bana Le</Text>
            <Text style={styles.songArtist}>Arijit Singh</Text>
          </View>

          <View>
            <Slider
              style={styles.progessBar}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="red"
              maximumTrackTintColor="black"
              thumbTintColor="red"
              value={playbackProgress}
              onSlidingStart={() => {
                if (isPlaying) {
                  sound.pauseAsync();
                }
              }}
              onValueChange={(value) => {
                setPlaybackProgress(value);
              }}
              onSlidingComplete={(value) => {
                sound.setPositionAsync(value * duration);
                sound.playAsync();
              }}
            />

            <View style={styles.durationContainer}>
              <Text>{formatTime(currentTime)}</Text>
              <Text>{formatTime(duration)}</Text>
            </View>
          </View>

          <View style={styles.controlContainer}>
            <TouchableOpacity>
              <MaterialIcons name="skip-previous" size={32} />
            </TouchableOpacity>
            <TouchableOpacity onPress={playSong}>
              {isPlaying ? (
                <AntDesign name="pause" size={32} color="black" />
              ) : (
                <AntDesign name="play" size={32} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="skip-next" size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "white",
    // borderTopLeftRadius: 10,
    height: "100%",
    // borderTopRightRadius: 10,
    alignItems: "center",
    paddingVertical: 23,
    paddingHorizontal: 25,
  },
  imageContainer: {
    width: 300,
    height: 340,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 4,
    borderColor: "red",
  },
  songTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "black",
  },
  songArtist: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    color: "grey",
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
