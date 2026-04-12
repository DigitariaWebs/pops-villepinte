import { Text, View } from "react-native";
import { Clock } from "lucide-react-native";

import { colors } from "@/constants/theme";

export type PickupCardProps = {
  minutes: number;
};

export default function PickupCard({
  minutes,
}: PickupCardProps): React.ReactElement {
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
        className="flex-row items-center"
        style={{ gap: 12, marginBottom: 20 }}
      >
        <View
          className="bg-primary-container items-center justify-center rounded-full"
          style={{ width: 48, height: 48 }}
        >
          <Clock size={22} color={colors.surface} strokeWidth={2} />
        </View>
        <View>
          <Text
            className="font-sans-bold text-on-surface-variant uppercase"
            style={{ fontSize: 10, letterSpacing: 2 }}
          >
            Retrait sur place
          </Text>
          <Text
            className="font-sans-bold text-on-surface"
            style={{ fontSize: 14, marginTop: 2 }}
          >
            POP&apos;S Villepinte
          </Text>
        </View>
      </View>

      <View
        className="bg-primary"
        style={{ width: 32, height: 2, marginBottom: 20 }}
      />

      <Text
        className="font-sans-semibold text-on-surface-variant uppercase"
        style={{ fontSize: 11, letterSpacing: 2 }}
      >
        Prête dans
      </Text>
      <View className="flex-row items-baseline" style={{ gap: 6, marginTop: 4 }}>
        <Text
          className="text-primary"
          style={{
            fontFamily: "PlusJakartaSans_800ExtraBold_Italic",
            fontSize: 56,
            letterSpacing: -2,
          }}
        >
          {minutes}
        </Text>
        <Text
          className="font-sans-semibold text-on-surface-variant"
          style={{ fontSize: 14, paddingBottom: 8 }}
        >
          minutes
        </Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          className="font-sans text-on-surface"
          style={{ fontSize: 13 }}
        >
          Avenue Gabriel Péri, 93420 Villepinte
        </Text>
        <Text
          className="font-sans text-on-surface-variant"
          style={{ fontSize: 12, marginTop: 2 }}
        >
          Ouvert jusqu&apos;à 00h00 · +33 6 51 30 XX XX
        </Text>
      </View>

      <View
        className="flex-row items-center"
        style={{ marginTop: 20, gap: 8 }}
      >
        <View
          className="bg-on-surface-variant rounded-full"
          style={{ width: 6, height: 6 }}
        />
        <Text
          className="font-sans text-on-surface-variant"
          style={{ fontSize: 12 }}
        >
          Paiement sur place · Cash ou CB
        </Text>
      </View>
    </View>
  );
}
