import { Pressable, Text, View } from "react-native";
import { ChevronRight, type LucideIcon } from "lucide-react-native";

import { colors } from "@/constants/theme";

export type SettingsRowProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
};

export default function SettingsRow({
  icon: Icon,
  label,
  onPress,
}: SettingsRowProps): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="flex-row items-center"
      style={({ pressed }) => ({
        paddingVertical: 14,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        className="bg-surface-container-high items-center justify-center rounded-full"
        style={{ width: 40, height: 40 }}
      >
        <Icon size={20} color={colors.ink} strokeWidth={1.75} />
      </View>

      <Text
        className="font-sans-semibold text-on-surface"
        style={{ fontSize: 15, flex: 1, marginLeft: 16 }}
      >
        {label}
      </Text>

      <ChevronRight size={18} color={colors.inkMuted} strokeWidth={2} />
    </Pressable>
  );
}
