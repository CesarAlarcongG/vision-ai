import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface Props {
  currentCard: React.ReactNode;
  nextCard?: React.ReactNode;
  previousCard?: React.ReactNode;

  onDelete: () => void;
  onRepeat: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function SwipeHistoryCard({
  currentCard,
  nextCard,
  previousCard,
  onDelete,
  onRepeat,
  onNext,
  onPrevious,
}: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const executeAction = (action: "delete" | "repeat" | "next" | "previous") => {
    switch (action) {
      case "delete":
        onDelete();
        break;

      case "repeat":
        onRepeat();
        break;

      case "next":
        onNext();
        break;

      case "previous":
        onPrevious();
        break;
    }
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      const threshold = 120;

      if (translateX.value < -threshold) {
        translateX.value = withTiming(-width * 1.5, {}, () => {
          runOnJS(executeAction)("delete");

          translateX.value = 0;
          translateY.value = 0;
        });

        return;
      }

      if (translateX.value > threshold) {
        translateX.value = withTiming(width * 1.5, {}, () => {
          runOnJS(executeAction)("repeat");

          translateX.value = 0;
          translateY.value = 0;
        });

        return;
      }

      if (translateY.value < -threshold) {
        translateY.value = withTiming(-height * 1.5, {}, () => {
          runOnJS(executeAction)("next");

          translateX.value = 0;
          translateY.value = 0;
        });

        return;
      }

      if (translateY.value > threshold) {
        translateY.value = withTiming(height * 1.5, {}, () => {
          runOnJS(executeAction)("previous");

          translateX.value = 0;
          translateY.value = 0;
        });

        return;
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const currentStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${translateX.value / 20}deg` },
    ],
  }));

  const nextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [-350, 0], [1, 0.2]),

    transform: [
      {
        scale: interpolate(translateY.value, [-350, 0], [1, 0.92]),
      },
    ],
  }));

  const previousStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, 350], [0.2, 1]),

    transform: [
      {
        scale: interpolate(translateY.value, [0, 350], [0.92, 1]),
      },
    ],
  }));

  const deleteStyle = useAnimatedStyle(() => {
    const isHorizontal =
      Math.abs(translateX.value) > Math.abs(translateY.value);

    return {
      opacity: isHorizontal
        ? interpolate(translateX.value, [-200, 0], [1, 0])
        : 0,
    };
  });

  const repeatStyle = useAnimatedStyle(() => {
    const isHorizontal =
      Math.abs(translateX.value) > Math.abs(translateY.value);

    return {
      opacity: isHorizontal
        ? interpolate(translateX.value, [0, 200], [0, 1])
        : 0,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.deleteOverlay, deleteStyle]}
      ></Animated.View>

      <Animated.View
        style={[styles.repeatOverlay, repeatStyle]}
      ></Animated.View>

      {previousCard && (
        <Animated.View style={[styles.backgroundCard, previousStyle]}>
          {previousCard}
        </Animated.View>
      )}

      {nextCard && (
        <Animated.View style={[styles.backgroundCard, nextStyle]}>
          {nextCard}
        </Animated.View>
      )}

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.currentCard, currentStyle]}>
          {currentCard}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 350,
  },

  currentCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10,
  },

  backgroundCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  deleteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ff4d4f",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 40,
  },

  repeatOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#52c41a",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 40,
  },

  icon: {
    fontSize: 56,
  },
});
