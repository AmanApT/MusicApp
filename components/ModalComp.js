import React, { useRef } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  PanResponder,
} from "react-native";

export default function ModalComp({
  windowHeight,
  isBottomSheetOpen,
  handleCloseBottomSheet,
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isBottomSheetOpen}
      onRequestClose={handleCloseBottomSheet}
    >
      <View
        style={[styles.bottomSheet, { height: windowHeight }]}
        {...panResponder.panHandlers}
      >
        <View
          style={{
            flex: 0,
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity onPress={handleCloseBottomSheet}></TouchableOpacity>
        </View>
        <View style={{ paddingVertical: 16 }}>
          {/* Your other content here */}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 23,
    paddingHorizontal: 25,
    bottom: 0,
    borderWidth: 1,
    borderColor: "red",
  },
});
