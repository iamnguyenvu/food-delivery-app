import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

interface AddToCartAnimationProps {
  visible: boolean;
  onComplete: () => void;
}

export default function AddToCartAnimation({ visible, onComplete }: AddToCartAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(30)).current;
  const ringScaleAnim = useRef(new Animated.Value(0.8)).current;
  const ringOpacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!visible) return;

    // Reset values
    scaleAnim.setValue(0.6);
    opacityAnim.setValue(0);
    translateAnim.setValue(30);
    ringScaleAnim.setValue(0.8);
    ringOpacityAnim.setValue(0.4);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 140,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          stiffness: 280,
          damping: 18,
          mass: 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          stiffness: 200,
          damping: 12,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(ringScaleAnim, {
          toValue: 2.3,
          duration: 320,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacityAnim, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: -20,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete();
    });
  }, [visible, scaleAnim, opacityAnim, translateAnim, ringScaleAnim, ringOpacityAnim, onComplete]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.pulse,
          {
            transform: [{ scale: ringScaleAnim }],
            opacity: ringOpacityAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleAnim }, { translateY: translateAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.iconBackground}>
          <Ionicons name="checkmark" size={32} color="white" />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  pulse: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#26C6DA",
    opacity: 0.4,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#26C6DA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#26C6DA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
});

