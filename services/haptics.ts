import * as Haptics from "expo-haptics";

export async function lightHaptic() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    console.log("Haptic error", error);
  }
}

export async function mediumHaptic() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.log("Haptic error", error);
  }
}

export async function successHaptic() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.log("Haptic error", error);
  }
}

export async function errorHaptic() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.log("Haptic error", error);
  }
}
