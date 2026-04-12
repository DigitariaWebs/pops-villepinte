import { useEffect, useRef, useState } from "react";
import {
  Animated as RNAnimated,
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Check } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const burgerIll = require("../../../assets/images/burgerillustartion.png") as number;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const friesIll = require("../../../assets/images/friesillustartion.png") as number;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tacosIll = require("../../../assets/images/tacosillustartion.png") as number;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoImage = require("../../../assets/images/logo.png") as number;

const { width: SW, height: SH } = Dimensions.get("window");

const ICONS = [burgerIll, friesIll, tacosIll];
const ROTATIONS = [-10, 14, -6, 18, -12, 8, -16, 10, -4, 20, -8, 12];

const LOADING_DURATION = 2000;

export type OrderConfirmationProps = {
  visible: boolean;
  onDone: () => void;
};

function FoodPatternFill(): React.ReactElement {
  const rows = Math.ceil(SH / 60) + 2;
  const cols = Math.ceil(SW / 50);
  const items: React.ReactElement[] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const src = ICONS[idx % ICONS.length]!;
      const rot = ROTATIONS[idx % ROTATIONS.length]!;
      items.push(
        <View
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            width: 36,
            height: 36,
            top: r * 60 + (c % 2 === 0 ? 0 : 30),
            left: c * 50 + (r % 2 === 0 ? 0 : 24),
            transform: [{ rotate: `${rot}deg` }],
            opacity: 0.15,
          }}
        >
          <Image
            source={src}
            contentFit="contain"
            style={{ width: 36, height: 36 }}
          />
        </View>,
      );
      idx++;
    }
  }
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: SH,
      }}
    >
      {items}
    </View>
  );
}

export default function OrderConfirmation({
  visible,
  onDone,
}: OrderConfirmationProps): React.ReactElement | null {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<"loading" | "confirmed">("loading");

  // Loading animations (RN Animated for the pattern slide-up + logo pulse)
  const patternTranslateY = useRef(new RNAnimated.Value(SH)).current;
  const logoPulse = useRef(new RNAnimated.Value(1)).current;
  const logoSpin = useRef(new RNAnimated.Value(0)).current;

  // Confirmed animations (Reanimated)
  const circleScale = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(16);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    if (!visible) {
      setPhase("loading");
      patternTranslateY.setValue(SH);
      logoPulse.setValue(1);
      logoSpin.setValue(0);
      circleScale.value = 0;
      checkScale.value = 0;
      titleOpacity.value = 0;
      titleTranslateY.value = 16;
      subtitleOpacity.value = 0;
      buttonOpacity.value = 0;
      buttonTranslateY.value = 20;
      return;
    }

    // Start loading phase
    setPhase("loading");

    // Pattern slides up from bottom
    RNAnimated.timing(patternTranslateY, {
      toValue: 0,
      duration: LOADING_DURATION,
      useNativeDriver: true,
    }).start();

    // Logo pulsing
    const pulse = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(logoPulse, {
          toValue: 1.15,
          duration: 500,
          useNativeDriver: true,
        }),
        RNAnimated.timing(logoPulse, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    // Logo spinning
    const spin = RNAnimated.loop(
      RNAnimated.timing(logoSpin, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    );
    spin.start();

    // After LOADING_DURATION, switch to confirmed
    const timer = setTimeout(() => {
      pulse.stop();
      spin.stop();
      setPhase("confirmed");

      // Animate confirmed state in
      circleScale.value = withSpring(1, { damping: 12, stiffness: 180 });
      checkScale.value = withDelay(
        200,
        withSpring(1, { damping: 10, stiffness: 200 }),
      );
      titleOpacity.value = withDelay(400, withTiming(1, { duration: 350 }));
      titleTranslateY.value = withDelay(400, withTiming(0, { duration: 350 }));
      subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 350 }));
      buttonOpacity.value = withDelay(800, withTiming(1, { duration: 350 }));
      buttonTranslateY.value = withDelay(
        800,
        withTiming(0, { duration: 350 }),
      );
    }, LOADING_DURATION);

    return () => {
      clearTimeout(timer);
      pulse.stop();
      spin.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const spinInterpolation = logoSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
        }}
      >
        {phase === "loading" ? (
          // Loading state
          <View style={{ flex: 1 }}>
            {/* Animated food pattern rising from bottom */}
            <RNAnimated.View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: SH,
                transform: [{ translateY: patternTranslateY }],
              }}
            >
              <FoodPatternFill />
            </RNAnimated.View>

            {/* Centered spinning/pulsing logo */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <RNAnimated.View
                style={{
                  transform: [
                    { scale: logoPulse },
                    { rotate: spinInterpolation },
                  ],
                }}
              >
                <Image
                  source={logoImage}
                  contentFit="contain"
                  style={{ width: 80, height: 80 }}
                />
              </RNAnimated.View>
            </View>
          </View>
        ) : (
          // Confirmed state
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 32,
            }}
          >
            {/* Green checkmark circle */}
            <Animated.View
              style={[
                {
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#1DB954",
                  alignItems: "center",
                  justifyContent: "center",
                },
                circleStyle,
              ]}
            >
              <Animated.View style={checkStyle}>
                <Check size={56} color="#FFFFFF" strokeWidth={3} />
              </Animated.View>
            </Animated.View>

            {/* Title */}
            <Animated.View
              style={[{ marginTop: 28, alignItems: "center" }, titleStyle]}
            >
              <Text
                style={{
                  fontFamily: "BebasNeue_400Regular",
                  fontSize: 36,
                  color: "#111111",
                  textAlign: "center",
                  letterSpacing: 1,
                }}
              >
                COMMANDE CONFIRMEE
              </Text>
            </Animated.View>

            {/* Subtitle */}
            <Animated.View
              style={[
                { marginTop: 14, alignItems: "center" },
                subtitleStyle,
              ]}
            >
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  lineHeight: 22,
                  color: "#6B6B6B",
                  textAlign: "center",
                }}
              >
                Tu peux venir recuperer ta commande dans environ 10 minutes.
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 13,
                  color: "#111111",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                POP'S Villepinte {"\u00B7"} Avenue Gabriel Peri
              </Text>
            </Animated.View>

            {/* CONTINUER button at the bottom */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  bottom: insets.bottom + 24,
                  left: 24,
                  right: 24,
                },
                buttonStyle,
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Continuer"
                onPress={onDone}
                style={{
                  backgroundColor: "#FFCE00",
                  borderRadius: 999,
                  paddingVertical: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#111111",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize: 14,
                    letterSpacing: 2,
                    color: "#111111",
                    textTransform: "uppercase",
                  }}
                >
                  Continuer
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        )}
      </View>
    </Modal>
  );
}
