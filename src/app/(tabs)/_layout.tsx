import { Tabs } from "expo-router";
import { Home, UtensilsCrossed, Receipt, User } from "lucide-react-native";

import { colors, font } from "@/constants/theme";

export default function TabLayout(): React.ReactNode {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.onSurface,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.outline,
          height: 84,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: font.semibold,
          fontSize: 11,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <UtensilsCrossed size={22} color={color} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Commandes",
          tabBarIcon: ({ color }) => <Receipt size={22} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <User size={22} color={color} strokeWidth={1.75} />,
        }}
      />
    </Tabs>
  );
}
