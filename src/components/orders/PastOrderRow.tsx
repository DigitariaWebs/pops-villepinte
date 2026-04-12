import { Pressable, Text, View } from "react-native";
import { RefreshCw } from "lucide-react-native";

import { colors, font, radius } from "@/constants/theme";
import { formatPriceEUR } from "@/lib/format";
import type { Order } from "@/types";

function formatFrenchDate(isoString: string): string {
  const date = new Date(isoString);
  const raw = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  picked_up: { label: "Récupérée", bg: "#E8F5E9", color: "#2E7D32" },
  cancelled: { label: "Annulée", bg: "#FFEBEE", color: "#C62828" },
  ready: { label: "Prête", bg: "#E8F5E9", color: "#2E7D32" },
  preparing: { label: "En préparation", bg: "#FFF8E1", color: "#F57F17" },
  received: { label: "Reçue", bg: "#F5F5F5", color: colors.inkMuted },
};

export type PastOrderRowProps = {
  order: Order;
  onReorder: () => void;
};

export default function PastOrderRow({
  order,
  onReorder,
}: PastOrderRowProps): React.ReactElement {
  const itemCount = order.items.reduce((a, i) => a + i.quantity, 0);
  const statusConfig = STATUS_LABELS[order.status] ?? STATUS_LABELS.received!;

  return (
    <View
      style={{
        marginHorizontal: 20,
        backgroundColor: "#FAFAFA",
        borderRadius: radius.lg,
        padding: 18,
      }}
    >
      {/* Top row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontFamily: font.body, fontSize: 12, color: colors.inkMuted }}>
          {formatFrenchDate(order.createdAt)}
        </Text>
        <View
          style={{
            backgroundColor: statusConfig.bg,
            borderRadius: radius.pill,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontFamily: font.bodySemi,
              fontSize: 11,
              color: statusConfig.color,
              letterSpacing: 0.5,
            }}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Order ID */}
      <Text
        style={{
          fontFamily: font.display,
          fontSize: 22,
          color: colors.ink,
          marginTop: 8,
        }}
      >
        {order.id}
      </Text>

      {/* Info */}
      <Text
        style={{
          fontFamily: font.body,
          fontSize: 13,
          color: colors.inkMuted,
          marginTop: 4,
        }}
      >
        {itemCount} article{itemCount > 1 ? "s" : ""} · {formatPriceEUR(order.totalEUR)}
      </Text>

      {/* Reorder */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Recommander la commande ${order.id}`}
        onPress={onReorder}
        hitSlop={12}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginTop: 14,
          alignSelf: "flex-start",
          backgroundColor: colors.primary,
          borderRadius: radius.pill,
          paddingHorizontal: 14,
          paddingVertical: 8,
        }}
      >
        <RefreshCw size={14} color={colors.ink} strokeWidth={2.5} />
        <Text
          style={{
            fontFamily: font.bodyBold,
            fontSize: 12,
            color: colors.ink,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Recommander
        </Text>
      </Pressable>
    </View>
  );
}
