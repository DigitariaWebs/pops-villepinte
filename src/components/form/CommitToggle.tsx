import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/theme";

export type CommitToggleProps = {
  value: boolean;
  onChange: (v: boolean) => void;
};

export default function CommitToggle({
  value,
  onChange,
}: CommitToggleProps): React.ReactElement {
  const dotScale = useSharedValue(value ? 1 : 0.85);
  const dotOpacity = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    if (value) {
      dotScale.value = withSequence(
        withTiming(1.1, { duration: 120 }),
        withTiming(1, { duration: 100 }),
      );
      dotOpacity.value = withTiming(1, { duration: 220 });
    } else {
      dotScale.value = withTiming(0.85, { duration: 160 });
      dotOpacity.value = withTiming(0, { duration: 160 });
    }
  }, [value, dotScale, dotOpacity]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotOpacity.value,
  }));

  const handlePress = (): void => {
    void Haptics.selectionAsync();
    onChange(!value);
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Je viens chercher ma commande"
      onPress={handlePress}
      className="flex-row items-start bg-surface-container rounded-xl"
      style={{ paddingHorizontal: 24, paddingVertical: 20, gap: 16 }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: value ? colors.primary : colors.surface,
          borderWidth: value ? 0 : 2,
          borderColor: colors.border,
        }}
      >
        <Animated.View style={dotStyle}>
          <Check size={16} color={colors.surface} strokeWidth={3} />
        </Animated.View>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          className="font-sans-bold text-on-surface"
          style={{ fontSize: 14, lineHeight: 18 }}
        >
          Je viens chercher ma commande
        </Text>
        <Text
          className="font-sans text-on-surface-variant"
          style={{ fontSize: 12, lineHeight: 16, marginTop: 4 }}
        >
          Ta parole compte. Si tu ne viens pas, ton compte pourrait être limité.
        </Text>
      </View>
    </Pressable>
  );
}
