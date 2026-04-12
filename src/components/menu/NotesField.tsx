import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Plus, X } from "lucide-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { colors } from "@/constants/theme";

const MAX_LENGTH = 120;

export type NotesFieldProps = {
  value: string;
  onChange: (next: string) => void;
};

export default function NotesField({
  value,
  onChange,
}: NotesFieldProps): React.ReactElement {
  // Auto-expand if there is already content (e.g. user re-opens the screen).
  const [expanded, setExpanded] = useState<boolean>(value.length > 0);

  if (!expanded) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ajouter une note au chef"
        onPress={() => setExpanded(true)}
        className="flex-row items-center"
        style={{
          paddingHorizontal: 24,
          marginTop: 32,
          paddingVertical: 14,
          gap: 8,
        }}
      >
        <Plus size={16} color={colors.primary} strokeWidth={2.5} />
        <Text className="font-sans-semibold text-primary" style={{ fontSize: 14 }}>
          Ajouter une note au chef
        </Text>
      </Pressable>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOut.duration(160)}
      style={{ paddingHorizontal: 24, marginTop: 32 }}
    >
      <Text
        className="font-sans-bold text-on-surface-variant uppercase"
        style={{ fontSize: 11, letterSpacing: 3, marginBottom: 8 }}
      >
        Note au chef
      </Text>

      <View className="bg-surface-container-low rounded-lg" style={{ position: "relative" }}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Bien cuit, sans oignons, pas trop de sauce..."
          placeholderTextColor={colors.inkMuted}
          multiline
          maxLength={MAX_LENGTH}
          textAlignVertical="top"
          className="font-sans text-on-surface"
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 28,
            paddingRight: 44,
            minHeight: 96,
            fontSize: 14,
            lineHeight: 20,
          }}
        />

        <Text
          className="font-sans text-on-surface-variant"
          style={{
            position: "absolute",
            bottom: 8,
            right: 16,
            fontSize: 10,
          }}
        >
          {value.length}/{MAX_LENGTH}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer la note"
          onPress={() => {
            onChange("");
            setExpanded(false);
          }}
          hitSlop={8}
          className="bg-surface-container-high items-center justify-center rounded-full"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 28,
            height: 28,
          }}
        >
          <X size={14} color={colors.inkMuted} strokeWidth={2.5} />
        </Pressable>
      </View>
    </Animated.View>
  );
}
