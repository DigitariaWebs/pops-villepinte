import { Text, View } from "react-native";

import { colors } from "@/constants/theme";

export type PickupInstructionsProps = {
  orderId: string;
};

export default function PickupInstructions({
  orderId,
}: PickupInstructionsProps): React.ReactElement {
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
        Retrait au comptoir
      </Text>

      <Text
        className="font-sans text-on-surface"
        style={{ fontSize: 13, lineHeight: 18, marginTop: 10 }}
      >
        Annonce ton prénom et montre ce numéro :
      </Text>

      <View
        className="bg-surface-container rounded-xl items-center justify-center"
        style={{
          paddingHorizontal: 24,
          paddingVertical: 20,
          marginTop: 16,
        }}
      >
        <Text
          className="text-primary"
          style={{
            fontFamily: "PlusJakartaSans_800ExtraBold_Italic",
            fontSize: 28,
            letterSpacing: -0.5,
          }}
        >
          {orderId}
        </Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          className="font-sans-bold text-on-surface"
          style={{ fontSize: 14 }}
        >
          POP&apos;S Villepinte
        </Text>
        <Text
          className="font-sans text-on-surface-variant"
          style={{ fontSize: 12, marginTop: 2 }}
        >
          Avenue Gabriel Péri, 93420 Villepinte
        </Text>
      </View>
    </View>
  );
}
