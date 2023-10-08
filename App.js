// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, StatusBar, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import searchIcon from "./assets/Vector.png";
import myMusicLogo from "./assets/Logo.png"

export default function App() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#22004e", "#000"]} style={styles.background}>
        {/* <StatusBar style="auto" color="white" /> */}
        <View>
          <View style={styles.brandContainer}>
            <View style={styles.brandContainerLeft}>
              <Image source={myMusicLogo} style={styles.logo} />
              <Text style={styles.logoText}>My Music</Text>
            </View>
            <Image source={searchIcon} style={styles.searchIcon} />
          </View>
        </View>
        <View style={styles.topPickContainer}>
          <Text style={styles.topPickHeading}>Top Picks</Text>
        </View>
        {/* <StatusBar style="auto" /> */}
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
  brandContainerLeft:{
    flexDirection:"row",
    alignItems:"center",
    gap:15
  },
  logo : {
    width: 40,
    height: 40,
  },
  background: {
    flex: 1,
    width: "100%",
    paddingTop: 50,
    padding: 20,
    // alignItems: "center",
    // justifyContent: "center",
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
    marginLeft:5,
    fontWeight: "700",
  },
  searchIcon: {
    width: 25,
    height: 25,
  },
});
