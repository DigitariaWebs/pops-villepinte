import { Text, View } from "react-native";

import { colors } from "@/constants/theme";
import type { OrderStatus } from "@/types";

type Step = {
  key: OrderStatus;
  label: string;
  activeSubtitle?: string;
};

const STEPS: Step[] = [
  { key: "received", label: "Commande reçue", activeSubtitle: "Votre commande est enregistrée." },
  { key: "preparing", label: "En préparation", activeSubtitle: "Votre commande est en cours…" },
  { key: "ready", label: "Prête à retirer", activeSubtitle: "Direction le comptoir !" },
  { key: "picked_up", label: "Récupérée", activeSubtitle: "Bon appétit !" },
];

const ORDER: OrderStatus[] = ["received", "preparing", "ready", "picked_up"];

function stepIndex(status: OrderStatus): number {
  const idx = ORDER.indexOf(status);
  return idx === -1 ? -1 : idx;
}

export type OrderTimelineProps = {
  status: OrderStatus;
};

export default function OrderTimeline({
  status,
}: OrderTimelineProps): React.ReactElement {
  const current = stepIndex(status);
  const isCancelled = status === "cancelled";

  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 28 }}>
      <Text
        className="font-sans-bold text-on-surface-variant uppercase"
        style={{ fontSize: 10, letterSpacing: 2, marginBottom: 20 }}
      >
        Suivi
      </Text>

      {STEPS.map((step, idx) => {
        const isCompleted = !isCancelled && current > idx;
        const isActive = !isCancelled && current === idx;
        const isFuture = isCancelled || current < idx;
        const isLast = idx === STEPS.length - 1;

        const dotColor = isCancelled
          ? colors.error
          : isCompleted || isActive
            ? colors.primary
            : colors.surfaceContainerHigh;

        const lineColor =
          isCompleted && !isCancelled
            ? colors.primary
            : colors.surfaceContainerHigh;

        return (
          <View key={step.key} className="flex-row" style={{ minHeight: isLast ? 36 : 56 }}>
            {/* Dot column */}
            <View style={{ width: 24, alignItems: "center" }}>
              {isActive && !isCancelled ? (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${colors.primary}26`,
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: dotColor,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: dotColor,
                    marginTop: 6,
                  }}
                />
              )}

              {!isLast ? (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    marginTop: 4,
                    backgroundColor: lineColor,
                  }}
                />
              ) : null}
            </View>

            {/* Label column */}
            <View style={{ flex: 1, paddingLeft: 16, paddingBottom: 8 }}>
              <Text
                className={`font-sans-semibold ${
                  isFuture ? "text-on-surface-variant" : "text-on-surface"
                }`}
                style={{ fontSize: 14, lineHeight: 20 }}
              >
                {step.label}
              </Text>
              {isActive && step.activeSubtitle !== undefined ? (
                <Text
                  className="font-sans text-on-surface-variant"
                  style={{ fontSize: 12, lineHeight: 16, marginTop: 2 }}
                >
                  {step.activeSubtitle}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
