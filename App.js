// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import searchIcon from "./assets/Vector.png";
import myMusicLogo from "./assets/Logo.png";
import song1 from "./assets/Song1.png";
import coverSong from "./assets/coverSong.mp3";
import coverSongImage from "./assets/coverSong.jpg";
import { useEffect, useRef, useState } from "react";
import ModalComp from "./components/ModalComp";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import gif from "./assets/gif.gif";
import {
  TopSongs1,
  OldHindiSongs,
  NewHindiSongs,
} from "./components/listOfSongs";
import AlbumList from "./components/AlbumList";

import * as Notifications from "expo-notifications";

export default function App() {
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error("Error setting up audio mode", error);
      }
    };

    setupAudio();
  }, []);

  const windowHeight = Dimensions.get("window").height;

  // This state would determine if the drawer sheet is visible or not
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [playbackProgress, setPlaybackProgress] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to open the bottom sheet
  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };

  // Function to close the bottom sheet
  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currSong, setCurrSong] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldPlayNext, setShouldPlayNext] = useState(false);
  const [albumListOpen, setAlbumListOpen] = useState(false);
  const [listOfSongsIndex, setListOfSongsIndex] = useState(0);
  const [albumIndex, setAlbumIndex] = useState(0);

  useEffect(() => {
    // Check if the next song should be played
    if (shouldPlayNext) {
      // Reset the shouldPlayNext state
      setShouldPlayNext(false);

      // Calculate the index of the next song
      const nextIndex = (currentIndex + 1) % TopSongs1.length;

      // Play the next song
      playSong(TopSongs1[nextIndex]);
    }
  }, [shouldPlayNext]);

  useEffect(() => {
    console.log("Notification response listener attached");

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification response received:", response);

        const actionIdentifier = response.actionIdentifier;
        switch (actionIdentifier) {
          case "PLAY_PAUSE":
            togglePlayPause();
            break;
          case "NEXT":
            // Handle next action
            break;
          // Add more cases for other actions if needed
        }
      }
    );

    return () => {
      console.log("Notification response listener removed");
      subscription.remove();
    };
  }, []);

  // const soundRef = useRef();

  const playSong = async (eachSong) => {
    try {
      if (sound) {
        if (eachSong.id !== currSong.id) {
          await sound.stopAsync();
          await sound.unloadAsync();

          // Load and play the new song
          const { sound: newSound, status } = await Audio.Sound.createAsync(
            eachSong.songPath,
            { shouldPlay: true, isLooping: false },
            onPlaybackStatusUpdate
          );

          setSound(newSound);
          setIsPlaying(true);
          setCurrSong(eachSong);
          setCurrentIndex(eachSong.id - 1);
        } else {
          await sound.stopAsync();
          await sound.unloadAsync();

          const { sound: newSound, status } = await Audio.Sound.createAsync(
            eachSong.songPath,
            { shouldPlay: true, isLooping: false },
            onPlaybackStatusUpdate
          );

          setSound(newSound);
          setIsPlaying(true);
          setCurrSong(eachSong);
          setCurrentIndex(eachSong.id - 1);
        }
      } else {
        // If there's no sound loaded, create a new one
        const { sound: newSound, status } = await Audio.Sound.createAsync(
          eachSong.songPath,
          { shouldPlay: true, isLooping: false },
          onPlaybackStatusUpdate
        );

        setCurrentIndex(eachSong.id - 1);
        setSound(newSound);
        setIsPlaying(true);
        setCurrSong(eachSong);
      }
      showMediaControlsNotification(eachSong.title);
    } catch (error) {
      console.error("Error playing the song", error);
    }
  };

  const togglePlayPause = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      } else {
        // If there's no sound loaded, create a new one and play it
        const { sound: newSound, status } = await Audio.Sound.createAsync(
          currSong.songPath,
          { shouldPlay: true, isLooping: false },
          onPlaybackStatusUpdate
        );

        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling play/pause", error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && !status.isLooping) {
      const progress = status.positionMillis / status.durationMillis;
      setPlaybackProgress(progress);
      setCurrentTime(status.positionMillis);
      setDuration(status.durationMillis);
    }
    if (status.didJustFinish && !isLoading) {
      setShouldPlayNext(true);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => playSong(item)}>
      <ImageBackground
        source={item.imagePath}
        style={styles.backgroundImage}
      ></ImageBackground>
      <Text style={styles.backgroundImageText}>{item.title}</Text>
    </TouchableOpacity>
  );

  let mediaControlsNotificationIdentifier = "mediaControlsNotification"; // Set a default identifier

  const showMediaControlsNotification = async (songTitle) => {
    try {
      // Set notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

      // Define custom actions for media controls
      const actionPlayPause = {
        identifier: "PLAY_PAUSE",
        title: isPlaying ? "Pause" : "Play",
      };

      const actionNext = {
        identifier: "NEXT",
        title: "Next",
      };

      // Register the actions
      await Notifications.setNotificationCategoryAsync("mediaControls", [
        actionPlayPause,
        actionNext,
      ]);

      // Check if a notification with the same identifier already exists
      const existingNotifications =
        await Notifications.getPresentedNotificationsAsync();

      // If a notification with the same identifier exists, update it
      if (existingNotifications.length > 0) {
        await Notifications.scheduleNotificationAsync({
          identifier: mediaControlsNotificationIdentifier,
          categoryId: "mediaControls",
          content: {
            title: "Basic Notification",
            body: songTitle,
          },
          trigger: null,
        });
      } else {
        // If no existing notification, schedule a new one
        const mainNotification = await Notifications.scheduleNotificationAsync({
          identifier: mediaControlsNotificationIdentifier,
          categoryId: "mediaControls",
          content: {
            title: "Basic Notification",
            body: songTitle,
          },
          trigger: null,
        });

        console.log("Media Controls Notification Scheduled:", mainNotification);
      }
    } catch (error) {
      console.error("Error scheduling media controls notification:", error);
    }
  };

  // console.log(sound);

  return (
    <>
      <ScrollView style={styles.container}>
        <LinearGradient colors={["#22004e", "#000"]} style={styles.background}>
          <View style={styles.brandContainer}>
            <View style={styles.brandContainerLeft}>
              <Image source={myMusicLogo} style={styles.logo} />
              <Text style={styles.logoText}>My Music</Text>
            </View>
            <Image source={searchIcon} style={styles.searchIcon} />
          </View>
          <View style={styles.topPickContainer}>
            <Text style={styles.topPickHeading}>Top Picks</Text>
          </View>

          <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
            <FlatList
              data={TopSongs1}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              // horizontal
              numColumns={5}
            />
            {/* <View style={styles.row}>
            <View>
              <ImageBackground
                source={song1}
                style={styles.backgroundImage}
              ></ImageBackground>
              <Text style={styles.backgroundImageText}>Apna Bana Le</Text>
            </View>
            <View>
              <ImageBackground
                source={song1}
                style={styles.backgroundImage}
              ></ImageBackground>
              <Text style={styles.backgroundImageText}>Apna Bana Le</Text>
            </View>
            <View>
              <ImageBackground
                source={song1}
                style={styles.backgroundImage}
              ></ImageBackground>
              <Text style={styles.backgroundImageText}>Apna Bana Le</Text>
            </View>
          </View> */}
          </ScrollView>

          <View style={{ marginTop: 30 }}>
            <Text
              style={{
                color: "white",
                fontSize: 25,
                fontWeight: 700,
                marginBottom: 30,
              }}
            >
              Hindi Songs
            </Text>
            <ScrollView horizontal>
              <TouchableOpacity
                onPress={() => {
                  setAlbumListOpen(true);
                  setAlbumIndex(0);
                  setListOfSongsIndex(1);
                }}
                style={{ marginRight: 20 }}
              >
                <ImageBackground
                  source={TopSongs1[0].imagePath}
                  style={{ width: 150, height: 150 }}
                />
                <Text style={{ color: "white" }}>Old Hindi Songs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAlbumListOpen(true);
                  setAlbumIndex(1);
                  setListOfSongsIndex(2);
                }}
              >
                <ImageBackground
                  source={TopSongs1[0].imagePath}
                  style={{ width: 150, height: 150 }}
                />
                <Text style={{ color: "white" }}>New/Cover Songs</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </LinearGradient>
      </ScrollView>
      <View
        style={{
          backgroundColor: "#22004e",
          height: 70,
          padding: 20,
        }}
      >
        <TouchableOpacity
          onPress={handleOpenBottomSheet}
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", gap: 200 }}>
            <View style={{ flexDirection: "row" }}>
              <ImageBackground
                source={currSong?.imagePath}
                style={{ width: 30, height: 30 }}
              />
              <Text style={{ color: "white", marginLeft: 10 }}>
                {currSong ? currSong.title : ""}
              </Text>
            </View>
          </View>
          {isPlaying ? (
            <ImageBackground source={gif} style={{ width: 30, height: 30 }} />
          ) : (
            <></>
          )}
        </TouchableOpacity>
        <ModalComp
          windowHeight={windowHeight}
          isBottomSheetOpen={isBottomSheetOpen}
          handleCloseBottomSheet={handleCloseBottomSheet}
          playSong={playSong}
          isPlaying={isPlaying}
          playbackProgress={playbackProgress}
          setPlaybackProgress={setPlaybackProgress}
          sound={sound}
          duration={duration}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          currSong={currSong}
          togglePlayPause={togglePlayPause}
          songs={
            listOfSongsIndex === 0
              ? TopSongs1
              : listOfSongsIndex === 1
              ? OldHindiSongs
              : NewHindiSongs
          }
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
        <AlbumList
          albumListOpen={albumListOpen}
          setAlbumListOpen={setAlbumListOpen}
          songs={albumIndex === 0 ? OldHindiSongs : NewHindiSongs}
          playSong={playSong}
          setListOfSongsIndex={setListOfSongsIndex}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  brandContainer: {
    marginTop: "5%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  brandContainerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  logo: {
    width: 40,
    height: 40,
  },
  background: {
    // flex: 1,
    // width: "100%",
    paddingTop: 50,
    padding: 15,
    // alignItems: "center",
    // justifyContent: "center",
  },
  scrollContainer: {
    // width: "100%",
    // flexDirection: "column",
    // alignItems: "flex-start",
    // height: 30,
    marginTop: "10%",
    // gap: 20,
    // borderColor: "white",
    // borderWidth: 10,
    // borderStyle: "solid",
  },

  row: {
    flexDirection: "row",
    // width: 200,
    // overflow: "scroll",
    // marginBottom: 10,
  },
  backgroundImage: {
    height: 120,
    width: 120,
    marginRight: 20,
    // width:"100%",
  },
  logoText: {
    fontSize: 25,
    color: "white",
  },
  topPickContainer: {
    marginTop: 40,
  },
  topPickHeading: {
    color: "white",
    fontSize: 25,
    marginLeft: 5,
    fontWeight: "700",
  },
  searchIcon: {
    width: 25,
    height: 25,
  },
  backgroundImageText: {
    color: "white",
  },
});
