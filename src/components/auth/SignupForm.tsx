import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";
import { useProfileStore } from "@/store/profile.store";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoImage = require("../../../assets/images/pops-logo.png") as number;

export type SignupFormProps = {
  phone: string;
  onComplete: () => void;
};

export default function SignupForm({
  phone,
  onComplete,
}: SignupFormProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const updateName = useProfileStore((s) => s.updateName);
  const setProfilePhone = useProfileStore((s) => s.setPhone);

  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleContinue = (): void => {
    if (name.trim().length < 2) {
      setError("Ton prénom est requis (2 caractères min).");
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    void updateName(name.trim());
    setProfilePhone(phone);
    onComplete();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingTop: insets.top + 60,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <Image
        source={logoImage}
        contentFit="contain"
        style={{ width: 60, height: 60, marginBottom: 32 }}
      />

      <Text
        style={{
          fontFamily: "BebasNeue_400Regular",
          fontSize: 44,
          lineHeight: 46,
          letterSpacing: 2,
          color: colors.ink,
        }}
      >
        C&apos;EST QUOI{"\n"}TON PRÉNOM ?
      </Text>

      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
          color: "rgba(0,0,0,0.55)",
          marginTop: 8,
        }}
      >
        Pour qu&apos;on sache qui vient chercher sa commande.
      </Text>

      <View
        style={{
          backgroundColor: colors.ink,
          borderRadius: 16,
          paddingHorizontal: 20,
          paddingVertical: 18,
          marginTop: 36,
        }}
      >
        <TextInput
          value={name}
          onChangeText={(v) => {
            setName(v);
            if (v.trim().length >= 2) setError(undefined);
          }}
          placeholder="Ton prénom"
          placeholderTextColor="rgba(255,206,0,0.35)"
          autoCapitalize="words"
          autoFocus
          maxLength={30}
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 18,
            color: colors.primary,
            paddingVertical: 0,
          }}
        />
      </View>

      {error !== undefined ? (
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 13,
            color: colors.accent,
            marginTop: 12,
          }}
        >
          {error}
        </Text>
      ) : null}

      <Pressable
        onPress={handleContinue}
        style={{
          backgroundColor: colors.ink,
          borderRadius: 999,
          paddingVertical: 18,
          alignItems: "center",
          marginTop: 28,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 14,
            letterSpacing: 1,
            color: colors.primary,
            textTransform: "uppercase",
          }}
        >
          C&apos;est parti
        </Text>
      </Pressable>
    </View>
  );
}
