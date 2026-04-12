import { useEffect } from "react";
import { Text, View } from "react-native";
import { Check } from "lucide-react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/theme";

const FINISH_DELAY_MS = 2200;

export type SuccessOverlayProps = {
  visible: boolean;
  onFinish: () => void;
  customerName?: string;
};

export default function SuccessOverlay({
  visible,
  onFinish,
  customerName,
}: SuccessOverlayProps): React.ReactElement | null {
  const reducedMotion = useReducedMotion();

  const circleScale = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(12);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    if (reducedMotion) {
      circleScale.value = 1;
      checkScale.value = 1;
      titleOpacity.value = 1;
      titleTranslateY.value = 0;
      subtitleOpacity.value = 1;
    } else {
      circleScale.value = withSpring(1, { damping: 12, stiffness: 180 });
      checkScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 200 }));
      titleOpacity.value = withDelay(500, withTiming(1, { duration: 350 }));
      titleTranslateY.value = withDelay(500, withTiming(0, { duration: 350 }));
      subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 350 }));
    }

    const timer = setTimeout(() => {
      runOnJS(onFinish)();
    }, FINISH_DELAY_MS);

    return () => clearTimeout(timer);
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

  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
      }}
    >
      <Animated.View
        style={[
          {
            width: 120,
            height: 120,
            borderRadius: 60,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.success,
          },
          circleStyle,
        ]}
      >
        <Animated.View style={checkStyle}>
          <Check size={56} color={colors.surface} strokeWidth={3} />
        </Animated.View>
      </Animated.View>

      <Animated.View style={[{ marginTop: 28, alignItems: "center" }, titleStyle]}>
        <Text
          className="text-on-surface"
          style={{
            fontFamily: "PlusJakartaSans_800ExtraBold_Italic",
            fontSize: 38,
            lineHeight: 42,
            letterSpacing: -1.5,
            textAlign: "center",
          }}
        >
          Bon appétit !
        </Text>
      </Animated.View>

      <Animated.View style={[{ marginTop: 12, alignItems: "center" }, subtitleStyle]}>
        <Text
          className="font-sans text-on-surface-variant"
          style={{ fontSize: 14, lineHeight: 20, textAlign: "center" }}
        >
          {customerName !== undefined
            ? `Merci ${customerName}, à très vite chez Pop's.`
            : "Merci, à très vite chez Pop's."}
        </Text>
      </Animated.View>
    </View>
  );
}
