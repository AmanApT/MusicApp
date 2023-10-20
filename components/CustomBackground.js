import React from "react";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import Animated, { interpolateColor, useAnimatedStyle } from "react-native-reanimated";


const CustomBackground = ({ style, animatedIndex }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      // @ts-ignore
      backgroundColor: interpolateColor(
        animatedIndex.value,
        [0,1],
        ["#a8b5eb", "#a8b5eb"]
      ),
    };
  });

  const containerStyle = style; // No need for useMemo in this case

  return <Animated.View pointerEvents="none" style={[containerStyle, containerAnimatedStyle]} />;
};

export default CustomBackground;
