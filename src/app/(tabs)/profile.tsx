import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import {
  Award,
  Bell,
  FileText,
  Heart,
  MessageCircle,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import Screen from "@/components/layout/Screen";
import TextField from "@/components/form/TextField";
import StatsCard from "@/components/profile/StatsCard";
import SettingsRow from "@/components/profile/SettingsRow";
import { colors } from "@/constants/theme";
import { useProfileStore } from "@/store/profile.store";

const PHONE_REGEX = /^0[67](\d{2}){4}$/;

function formatFrenchMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

export default function ProfileScreen(): React.ReactElement {
  const profile = useProfileStore((s) => s.profile);
  const setProfileName = useProfileStore((s) => s.setName);
  const setProfilePhone = useProfileStore((s) => s.setPhone);

  const [name, setName] = useState<string>(
    profile.name === "Invité" ? "" : profile.name,
  );
  const [phone, setPhone] = useState<string>(
    profile.phone
      ? formatFrenchMobile(profile.phone)
      : "",
  );
  const [saved, setSaved] = useState(false);
  const [phoneError, setPhoneError] = useState<string | undefined>();

  const displayName =
    profile.name === "Invité" ? "Salut." : profile.name + ".";

  const handlePhoneChange = (v: string): void => {
    const formatted = formatFrenchMobile(v);
    setPhone(formatted);
    setSaved(false);
    const digits = formatted.replace(/\s/g, "");
    if (digits.length === 0 || digits.length < 10) {
      setPhoneError(undefined);
      return;
    }
    if (!PHONE_REGEX.test(digits)) {
      setPhoneError("Numéro invalide. Format attendu : 06 ou 07 …");
    } else {
      setPhoneError(undefined);
    }
  };

  const handleNameChange = (v: string): void => {
    setName(v);
    setSaved(false);
  };

  const handleSave = (): void => {
    const trimmedName = name.trim();
    const phoneDigits = phone.replace(/\s/g, "");

    if (phoneDigits.length > 0 && !PHONE_REGEX.test(phoneDigits)) {
      setPhoneError("Numéro invalide.");
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (trimmedName.length >= 2) {
      setProfileName(trimmedName);
    }
    if (phoneDigits.length > 0) {
      setProfilePhone(phoneDigits);
    }

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleStubPress = (): void => {
    Alert.alert("Bientôt", "Cette fonctionnalité arrive dans une prochaine version.");
  };

  return (
    <Screen>
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <Text
          className="font-sans-semibold text-on-surface-variant uppercase"
          style={{ fontSize: 11, letterSpacing: 3 }}
        >
          Mon profil
        </Text>
        <Text
          className="text-on-surface"
          style={{
            fontFamily: "PlusJakartaSans_800ExtraBold_Italic",
            fontSize: 44,
            lineHeight: 48,
            letterSpacing: -1.5,
            marginTop: 4,
          }}
        >
          {displayName}
        </Text>
      </View>

      {/* Stats card */}
      <View style={{ marginTop: 32 }}>
        <StatsCard
          orderCount={profile.orderCount}
          name={profile.name === "Invité" ? "toi" : profile.name}
        />
      </View>

      {/* Editable fields */}
      <View style={{ marginTop: 32 }}>
        <Text
          className="font-sans-bold text-on-surface-variant uppercase"
          style={{
            fontSize: 10,
            letterSpacing: 2,
            paddingHorizontal: 24,
            marginBottom: 16,
          }}
        >
          Informations
        </Text>

        <View style={{ paddingHorizontal: 24 }}>
          <TextField
            label="Prénom"
            value={name}
            onChangeText={handleNameChange}
            placeholder="Comment tu t'appelles ?"
            autoCapitalize="words"
            autoComplete="given-name"
            maxLength={40}
          />
        </View>

        <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
          <TextField
            label="Téléphone"
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="06 12 34 56 78"
            error={phoneError}
            helper="Optionnel — on t'appelle quand c'est prêt."
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={14}
            autoCapitalize="none"
          />
        </View>

        <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mettre à jour le profil"
            onPress={handleSave}
            className="bg-primary rounded-full items-center justify-center"
            style={{
              paddingVertical: 16,
            }}
          >
            <Text
              className="uppercase"
              style={{
                fontFamily: "PlusJakartaSans_700Bold",
                fontSize: 12,
                letterSpacing: 2,
                color: colors.surface,
              }}
            >
              {saved ? "Enregistré ✓" : "Mettre à jour"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Settings stubs */}
      <View style={{ marginTop: 40 }}>
        <Text
          className="font-sans-bold text-on-surface-variant uppercase"
          style={{
            fontSize: 10,
            letterSpacing: 2,
            paddingHorizontal: 24,
            marginBottom: 8,
          }}
        >
          Réglages
        </Text>
        <View style={{ paddingHorizontal: 24 }}>
          <SettingsRow icon={Heart} label="Favoris" onPress={handleStubPress} />
          <SettingsRow icon={Award} label="Fidélité" onPress={handleStubPress} />
          <SettingsRow icon={Bell} label="Notifications" onPress={handleStubPress} />
          <SettingsRow icon={FileText} label="Conditions générales" onPress={handleStubPress} />
          <SettingsRow icon={MessageCircle} label="Nous contacter" onPress={handleStubPress} />
        </View>
      </View>

      {/* Tombstone */}
      <View
        className="items-center"
        style={{ paddingHorizontal: 24, marginTop: 40 }}
      >
        <View
          style={{
            width: 32,
            height: 2,
            backgroundColor: colors.editorialRule,
            marginBottom: 16,
          }}
        />
        <Text
          className="font-sans-semibold text-on-surface-variant uppercase"
          style={{ fontSize: 10, letterSpacing: 3, textAlign: "center" }}
        >
          Pop&apos;s Villepinte · v1.0 · by Progix
        </Text>
      </View>
    </Screen>
  );
}
