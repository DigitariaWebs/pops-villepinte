import { Pressable, Text, View } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

type StepButtonProps = {
  icon: typeof Plus;
  onPress: () => void;
  disabled: boolean;
  variant: "minus" | "plus";
  accessibilityLabel: string;
};

function StepButton({
  icon: Icon,
  onPress,
  disabled,
  variant,
  accessibilityLabel,
}: StepButtonProps): React.ReactElement {
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
    opacity: disabled ? 0.3 : 1,
  }));

  const isPlus = variant === "plus";
  const iconColor = isPlus ? colors.surface : colors.ink;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      onPress={() => {
        if (disabled) return;
        void Haptics.selectionAsync();
        onPress();
      }}
      onPressIn={() => {
        if (disabled) return;
        pressScale.value = withTiming(0.92, { duration: 120 });
      }}
      onPressOut={() => {
        pressScale.value = withTiming(1, { duration: 160 });
      }}
      hitSlop={8}
      className={`items-center justify-center rounded-full ${
        isPlus ? "bg-on-surface" : "bg-surface-container-high"
      }`}
      style={[{ width: 44, height: 44 }, animatedStyle]}
    >
      <Icon size={20} color={iconColor} strokeWidth={2.5} />
    </AnimatedPressable>
  );
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
}: QuantityStepperProps): React.ReactElement {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <View
      className="flex-row items-center"
      style={{ paddingHorizontal: 24, marginTop: 32, gap: 20 }}
    >
      <Text
        className="font-sans-bold text-on-surface-variant uppercase"
        style={{ fontSize: 11, letterSpacing: 3 }}
      >
        Quantité
      </Text>

      <View style={{ flex: 1 }} />

      <StepButton
        icon={Minus}
        onPress={() => onChange(value - 1)}
        disabled={atMin}
        variant="minus"
        accessibilityLabel="Diminuer la quantité"
      />

      <View
        style={{
          minWidth: 48,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* New digit slides in / old digit slides out via Reanimated layout */}
        <Animated.View
          key={value}
          entering={FadeInUp.duration(180)}
          exiting={FadeOut.duration(180)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            className="text-on-surface"
            style={{
              fontFamily: "BebasNeue_400Regular",
              fontSize: 32,
              lineHeight: 36,
              textAlign: "center",
            }}
          >
            {value}
          </Text>
        </Animated.View>
      </View>

      <StepButton
        icon={Plus}
        onPress={() => onChange(value + 1)}
        disabled={atMax}
        variant="plus"
        accessibilityLabel="Augmenter la quantité"
      />
    </View>
  );
}
