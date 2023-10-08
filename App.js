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
        <Text>Heeellu World</Text>
        {/* <StatusBar style="auto" /> */}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
