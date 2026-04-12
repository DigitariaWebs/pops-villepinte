import { Text, View } from "react-native";

import { colors } from "@/constants/theme";

export type StatsCardProps = {
  orderCount: number;
  name: string;
};

function loyaltyCopy(count: number, name: string): string {
  if (count === 0) return "Premier passage ? Bienvenue dans la famille Pop's.";
  if (count <= 5) return `Bienvenue chez nous, ${name}. On te reconnaît déjà.`;
  if (count <= 15)
    return "Tu fais partie des habitués. On garde ta place au chaud.";
  return `Légende vivante. Respect, ${name}.`;
}

export default function StatsCard({
  orderCount,
  name,
}: StatsCardProps): React.ReactElement {
  return (
    <View
      className="bg-surface-container-low rounded-xl"
      style={{
        marginHorizontal: 24,
        paddingHorizontal: 28,
        paddingVertical: 28,
      }}
    >
      <View
        className="bg-primary"
        style={{ width: 32, height: 2, marginBottom: 20 }}
      />

      <Text
        className="font-sans-bold text-on-surface-variant uppercase"
        style={{ fontSize: 10, letterSpacing: 2 }}
      >
        Commandes passées
      </Text>

      <Text
        className="text-primary"
        style={{
          fontFamily: "PlusJakartaSans_800ExtraBold_Italic",
          fontSize: 56,
          letterSpacing: -2,
          marginTop: 4,
        }}
      >
        {orderCount}
      </Text>

      <Text
        className="font-sans text-on-surface-variant"
        style={{ fontSize: 14, lineHeight: 20, marginTop: 12 }}
      >
        {loyaltyCopy(orderCount, name)}
      </Text>
    </View>
  );
}
