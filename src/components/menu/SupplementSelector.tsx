import { Pressable, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/theme";
import { formatPriceEUR } from "@/lib/format";
import type { Supplement } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type SupplementSelectorProps = {
  supplements: Supplement[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

type SupplementRowProps = {
  supplement: Supplement;
  selected: boolean;
  onToggle: () => void;
};

function SupplementRow({
  supplement,
  selected,
  onToggle,
}: SupplementRowProps): React.ReactElement {
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const isFreeSpicy = supplement.priceEUR === 0;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={supplement.name}
      accessibilityState={{ selected }}
      onPress={() => {
        void Haptics.selectionAsync();
        onToggle();
      }}
      onPressIn={() => {
        pressScale.value = withTiming(0.98, { duration: 120 });
      }}
      onPressOut={() => {
        pressScale.value = withTiming(1, { duration: 160 });
      }}
      className={`flex-row items-center justify-between rounded-lg ${
        selected ? "bg-secondary-container" : "bg-surface-container-low"
      }`}
      style={[
        { height: 64, paddingHorizontal: 20 },
        animatedStyle,
      ]}
    >
      <Text
        className={`font-sans-semibold ${
          selected ? "text-on-secondary-container" : "text-on-surface"
        }`}
        style={{ fontSize: 15, flex: 1, paddingRight: 12 }}
      >
        {supplement.name}
      </Text>

      {selected ? (
        <View
          className="bg-on-secondary-container items-center justify-center rounded-full"
          style={{ width: 28, height: 28 }}
        >
          <Check size={16} color={colors.primary} strokeWidth={3} />
        </View>
      ) : isFreeSpicy ? (
        <View
          className="bg-primary rounded-full"
          style={{ paddingHorizontal: 10, paddingVertical: 4 }}
        >
          <Text
            className="font-sans-bold"
            style={{ fontSize: 9, letterSpacing: 2, color: colors.surface }}
          >
            SPICY
          </Text>
        </View>
      ) : (
        <Text
          className="font-sans text-on-surface-variant"
          style={{ fontSize: 13 }}
        >
          + {formatPriceEUR(supplement.priceEUR)}
        </Text>
      )}
    </AnimatedPressable>
  );
}

export default function SupplementSelector({
  supplements,
  selectedIds,
  onToggle,
}: SupplementSelectorProps): React.ReactElement {
  return (
    <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
      <View
        className="flex-row items-center justify-between"
        style={{ marginBottom: 14 }}
      >
        <Text
          className="font-sans-bold text-on-surface-variant uppercase"
          style={{ fontSize: 11, letterSpacing: 3 }}
        >
          Suppléments
        </Text>
        <Text
          className="font-sans text-on-surface-variant"
          style={{ fontSize: 11 }}
        >
          Optionnel · +1 € chacun
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        {supplements.map((s) => (
          <SupplementRow
            key={s.id}
            supplement={s}
            selected={selectedIds.includes(s.id)}
            onToggle={() => onToggle(s.id)}
          />
        ))}
      </View>
    </View>
  );
}
