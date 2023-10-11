import React, { useRef } from "react";
import cover from '../assets/coverSong.jpg'
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  PanResponder,
  Image,
  Text,
  ImageBackground,
} from "react-native";
// import image from "../assets/"
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
  currSong
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
      <LinearGradient colors={["#8BF5FA", "#000"]} style={styles.background}>
      <View style={[styles.modalContainer]}>
        <View style={styles.bottomSheet} {...panResponder.panHandlers}>
          <View style={styles.imageContainer}>
            <ImageBackground
            source={currSong ? currSong.imagePath : cover} style={{ width: 290, height: 290 }}
            />
          </View>
          <View>
            <Text style={styles.songTitle}>{currSong ? currSong.title: ""}</Text>
            <Text style={styles.songArtist}>{currSong ? currSong.artist: ""}</Text>
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
                setPlaybackProgress(value);
              }}
              onSlidingComplete={(value) => {
                sound.setPositionAsync(value * duration);
                if (isPlaying) {
                  sound.playAsync();
                }
              }}
            />

            <View style={styles.durationContainer}>
              <Text style={styles.currentTime} >{formatTime(currentTime)}</Text>
              <Text style={styles.currentTime} >{formatTime(duration)}</Text>
            </View>
          </View>

          <View style={styles.controlContainer}>
            <TouchableOpacity>
              <MaterialIcons color="white" name="skip-previous" size={32} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>(playSong(currSong))}>
              {isPlaying ? (
                <AntDesign name="pause" size={32} color="white" />
              ) : (
                <AntDesign name="play" size={32} color="white" />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons color="white" name="skip-next" size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background:{
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
  currentTime:{
color:"white"
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
