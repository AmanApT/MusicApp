// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import searchIcon from "./assets/Vector.png";
import myMusicLogo from "./assets/Logo.png";
import song1 from "./assets/Song1.png";

export default function App() {
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
            <View>
              <ImageBackground source={song1} style={styles.backgroundImage}>
                {/* <View style={styles.content}>
                <Text style={styles.text}>Item 1</Text>
              </View> */}
              </ImageBackground>
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
              <ImageBackground source={song1} style={styles.backgroundImage}>
                {/* <View style={styles.content}>
                  <Text style={styles.text}>Arijit Singh</Text>
                </View> */}
              </ImageBackground>
              <Text style={styles.backgroundImageText}>Apna Bana Le</Text>
            </View>
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
