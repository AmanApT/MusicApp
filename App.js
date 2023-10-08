// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          "#2E013F",
          "rgba(8, 0, 26, 0.85)",
          "rgba(0, 0, 0, 0.95)",
          "#28164F",
        ]}
        style={styles.background}
      >
        {/* <StatusBar style="auto" color="white" /> */}
        <View>
          <View>
            <Text style={styles.logoText}>My Music</Text>
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
  background: {
    flex: 1,
    width: "100%",
    paddingTop: 50,
    padding: 20,
    // alignItems: "center",
    // justifyContent: "center",
  },
  logoText: {
    fontSize: 20,
    color: "white",
  },
  topPickContainer: {
    marginTop: 40,
  },
  topPickHeading: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
});
