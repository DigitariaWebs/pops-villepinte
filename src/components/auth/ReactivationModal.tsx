import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, Text, View } from "react-native";
import { PartyPopper } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { colors, font, radius, shadow } from "@/constants/theme";
import { accountApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

/**
 * "Welcome back" prompt shown once when a sign-in reactivated an account that
 * was pending self-service deletion. The server has already cancelled the
 * deletion by the time this renders, so staying needs no extra call — the user
 * only has to confirm. Choosing to go through with the deletion re-files it and
 * signs them out ("disconnect").
 */
export default function ReactivationModal(): React.ReactElement | null {
  const justReactivated = useAuthStore((s) => s.justReactivated);
  const dismissReactivation = useAuthStore((s) => s.dismissReactivation);
  const logout = useAuthStore((s) => s.logout);
  const [submitting, setSubmitting] = useState(false);

  if (!justReactivated) return null;

  const stay = (): void => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dismissReactivation();
  };

  const continueDeletion = (): void => {
    void (async () => {
      try {
        setSubmitting(true);
        // Re-file the deletion (the sign-in had cancelled it) and disconnect.
        await accountApi.deleteAccount({});
        dismissReactivation();
        await logout();
      } catch (e) {
        Alert.alert(
          "Erreur",
          e instanceof Error
            ? e.message
            : "La suppression n'a pas pu être relancée. Réessaie.",
        );
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={stay}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 28,
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: colors.white,
            borderRadius: radius.xl,
            paddingTop: 28,
            paddingBottom: 20,
            paddingHorizontal: 24,
            alignItems: "center",
            ...shadow.float,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(255,206,0,0.18)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <PartyPopper size={28} color={colors.ink} strokeWidth={2.25} />
          </View>

          <Text
            style={{
              fontFamily: font.display,
              fontSize: 32,
              lineHeight: 34,
              letterSpacing: 1,
              color: colors.ink,
              textAlign: "center",
            }}
          >
            BON RETOUR !
          </Text>

          <Text
            style={{
              fontFamily: font.bodyMedium,
              fontSize: 14,
              lineHeight: 20,
              color: colors.inkMuted,
              textAlign: "center",
              marginTop: 10,
              maxWidth: 300,
            }}
          >
            Ton compte était programmé pour suppression — on l'a annulée, tes
            données sont de retour. Tu veux quand même continuer la suppression ?
          </Text>

          <View
            style={{
              width: 32,
              height: 3,
              backgroundColor: colors.primary,
              borderRadius: 2,
              marginTop: 20,
              marginBottom: 24,
            }}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rester connecté"
            disabled={submitting}
            onPress={stay}
            style={({ pressed }) => ({
              alignSelf: "stretch",
              backgroundColor: colors.ink,
              borderRadius: radius.pill,
              paddingVertical: 16,
              alignItems: "center",
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: font.bodyBold,
                fontSize: 14,
                letterSpacing: 1.2,
                color: colors.white,
                textTransform: "uppercase",
              }}
            >
              Non, je reste
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continuer la suppression et se déconnecter"
            disabled={submitting}
            onPress={continueDeletion}
            style={({ pressed }) => ({
              alignSelf: "stretch",
              paddingVertical: 15,
              marginTop: 8,
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            {submitting ? (
              <ActivityIndicator color={colors.accent} />
            ) : (
              <Text
                style={{
                  fontFamily: font.bodyBold,
                  fontSize: 13,
                  letterSpacing: 0.8,
                  color: colors.accent,
                }}
              >
                Continuer la suppression
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
