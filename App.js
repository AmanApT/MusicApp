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
import TopSongs1 from "./components/listOfSongs";

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

  return (
    <View style={styles.container}>
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
          <View style={styles.row}>
            {TopSongs1.map((eachSong, id) => {
              return (
                <TouchableOpacity key={id} onPress={() => playSong(eachSong)}>
                  <ImageBackground
                    source={eachSong.imagePath}
                    style={styles.backgroundImage}
                  ></ImageBackground>
                  <Text style={styles.backgroundImageText}>
                    {eachSong.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.row}>
            <View>
              <ImageBackground source={song1} style={styles.backgroundImage}>
                {/* <View style={styles.content}>
                  <Text style={styles.text}>Arijit Singh</Text>
                </View> */}
              </ImageBackground>
              <Text style={styles.backgroundImageText}>Apna Bana Le</Text>
            </View>
            <View>
              <ImageBackground source={song1} style={styles.backgroundImage}>
                {/* <View style={styles.content}>
                  <Text style={styles.text}>Arijit Singh</Text>
                </View> */}
              </ImageBackground>
              <Text style={styles.backgroundImageText}>Apna Bana Le</Text>
            </View>
            <View>
              <ImageBackground source={song1} style={styles.backgroundImage}>
                {/* <View style={styles.content}>
                  <Text style={styles.text}>Arijit Singh</Text>
                </View> */}
              </ImageBackground>
              <Text style={styles.backgroundImageText}>Apna Bana Le</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      <View
        style={{
          backgroundColor: "#22004e",
          height: 70,
          // paddingLeft: 20,
          // paddingRight: 20,
          padding: 20,
          // width: "80%",
        }}
      >
        <TouchableOpacity
          onPress={handleOpenBottomSheet}
          style={{
            flex: 1,

            // width: "90%",
            // alignItems: "flex-start",
            // paddingHorizontal: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // borderWidth: 1,
            // borderColor: "#86827e",
            // paddingVertical: 12,
            // borderRadius: 8,
          }}
        >
          {/* <Text style={{ color: "white" }}>Click Me</Text> */}
          <View style={{ flexDirection: "row", gap: 200 }}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{ backgroundColor: "yellow", width: 30, height: 30 }}
              ></View>
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
          TopSongs1={TopSongs1}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </View>
    </View>
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
    flex: 1,
    width: "100%",
    paddingTop: 50,
    padding: 15,
    // alignItems: "center",
    // justifyContent: "center",
  },
  scrollContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: "10%",
    gap: 20,
  },

  row: {
    flexDirection: "row",
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
