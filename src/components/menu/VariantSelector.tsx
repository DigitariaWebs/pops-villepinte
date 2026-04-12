import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { ProductVariant } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  label: string;
};

type VariantChipProps = {
  variant: ProductVariant;
  selected: boolean;
  onSelect: () => void;
};

function VariantChip({ variant, selected, onSelect }: VariantChipProps): React.ReactElement {
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={variant.label}
      accessibilityState={{ selected }}
      onPress={() => {
        if (selected) return;
        void Haptics.selectionAsync();
        onSelect();
      }}
      onPressIn={() => {
        pressScale.value = withTiming(0.96, { duration: 120 });
      }}
      onPressOut={() => {
        pressScale.value = withTiming(1, { duration: 160 });
      }}
      className={`items-center justify-center rounded-lg ${
        selected ? "bg-primary" : "bg-surface-container-high"
      }`}
      style={[
        {
          height: 56,
          minWidth: 64,
          paddingHorizontal: 20,
        },
        animatedStyle,
      ]}
    >
      <Text
        className={`font-sans-bold ${selected ? "text-surface" : "text-on-surface"}`}
        style={{ fontSize: 15, letterSpacing: -0.2 }}
      >
        {variant.label}
      </Text>
    </AnimatedPressable>
  );
}

export default function VariantSelector({
  variants,
  selectedId,
  onSelect,
  label,
}: VariantSelectorProps): React.ReactElement {
  return (
    <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
      <View
        className="flex-row items-center justify-between"
        style={{ marginBottom: 14 }}
      >
        <Text
          className="font-sans-bold text-on-surface-variant uppercase"
          style={{ fontSize: 11, letterSpacing: 3 }}
        >
          {label}
        </Text>
        <Text
          className="font-sans text-primary"
          style={{ fontSize: 11 }}
        >
          Obligatoire
        </Text>
      </View>

      <View className="flex-row flex-wrap" style={{ gap: 10 }}>
        {variants.map((variant) => (
          <VariantChip
            key={variant.id}
            variant={variant}
            selected={variant.id === selectedId}
            onSelect={() => onSelect(variant.id)}
          />
        ))}
      </View>
    </View>
  );
}
