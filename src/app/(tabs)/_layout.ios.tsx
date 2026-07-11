import { Fragment } from "react";
import { NativeTabs } from "expo-router/unstable-native-tabs";

import ReactivationModal from "@/components/auth/ReactivationModal";
import { colors } from "@/constants/theme";

/**
 * iOS tab bar — the real UIKit tab bar via expo-router NativeTabs. On iOS 26
 * this renders the system Liquid Glass material automatically (and the OS blur
 * material on earlier iOS), so we use no custom UI here. SF Symbols give the
 * native filled/outline selected states.
 *
 * Bonus: each tab is a persistent native view controller, so switching tabs
 * (e.g. Menu → Commandes → Menu) never blanks the screen — that was the
 * detach/transform glitch from the JS `animation: "shift"` tab bar, which now
 * only runs on Android/web (see _layout.tsx).
 */
export default function TabLayout(): React.ReactNode {
  return (
    <Fragment>
      <NativeTabs
        // Selected icon + label use the brand ink (was accent red); unselected
        // fall back to a muted ink so the bar reads neutral over the glass.
        tintColor={colors.ink}
        iconColor={{ default: colors.inkMuted, selected: colors.ink }}
        // Subtle dark wash layered over the Liquid Glass / blur material so the
        // bar gains a bit of body and separates from light content above it.
        backgroundColor="rgba(17,17,17,0.10)"
      >
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} />
          <NativeTabs.Trigger.Label>Accueil</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="menu">
          <NativeTabs.Trigger.Icon sf="fork.knife" />
          <NativeTabs.Trigger.Label>Menu</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="orders">
          <NativeTabs.Trigger.Icon sf={{ default: "bag", selected: "bag.fill" }} />
          <NativeTabs.Trigger.Label>Commandes</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <NativeTabs.Trigger.Icon sf={{ default: "person", selected: "person.fill" }} />
          <NativeTabs.Trigger.Label>Profil</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
      <ReactivationModal />
    </Fragment>
  );
}
