import { useCallback } from "react";
import { Alert } from "react-native";

import { useAuthStore } from "@/store/auth.store";

/**
 * Gate for account-based actions while in guest mode.
 *
 * Returns `requireAccount(actionLabel?)`:
 *  - If the user is authed → returns `true`, caller proceeds.
 *  - If the user is a guest → shows a login prompt and returns `false`.
 *    Tapping "Se connecter" exits guest mode and routes to the OTP flow
 *    (the root layout swaps to AuthFlow once guestMode is false + authChoice
 *    is set).
 *
 * `actionLabel` completes the sentence "Connecte-toi ou crée un compte pour …"
 * (e.g. "passer commande", "ajouter aux favoris").
 */
export function useRequireAccount(): (actionLabel?: string) => boolean {
  const authed = useAuthStore((s) => s.authed);
  const exitGuest = useAuthStore((s) => s.exitGuest);
  const setAuthChoice = useAuthStore((s) => s.setAuthChoice);

  return useCallback(
    (actionLabel?: string): boolean => {
      if (authed) return true;

      const message = actionLabel
        ? `Connecte-toi ou crée un compte pour ${actionLabel}.`
        : "Connecte-toi ou crée un compte pour continuer.";

      Alert.alert("Crée un compte", message, [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se connecter",
          onPress: () => {
            setAuthChoice("signin");
            exitGuest();
          },
        },
      ]);
      return false;
    },
    [authed, exitGuest, setAuthChoice],
  );
}
