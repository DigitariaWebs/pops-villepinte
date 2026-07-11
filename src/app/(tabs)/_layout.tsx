import { Fragment } from "react";
import { Tabs } from "expo-router";
import { Home, UtensilsCrossed, Receipt, User } from "lucide-react-native";

import ReactivationModal from "@/components/auth/ReactivationModal";
import FloatingTabBar from "@/components/layout/FloatingTabBar";
import { colors } from "@/constants/theme";

export default function TabLayout(): React.ReactNode {
  return (
    <Fragment>
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkMuted,
        // Cross-fade between tabs. We deliberately avoid the transform-based
        // "shift" animation: combined with react-native-screens' detach of
        // inactive tabs, returning to a previously-visited tab (e.g. Menu →
        // Commandes → Menu) could leave the screen translated off-frame and
        // render blank. A fade keeps every screen at translateX 0, so it
        // always re-appears correctly. (iOS uses the native tab bar instead —
        // see _layout.ios.tsx.)
        animation: "fade",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <UtensilsCrossed size={22} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Commandes",
          tabBarIcon: ({ color }) => <Receipt size={22} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <User size={22} color={color} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
    <ReactivationModal />
    </Fragment>
  );
}
