import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { colors, font, radius, shadow } from "@/constants/theme";
import type { Order } from "@/types";

export type StatusFilter = "all" | "picked_up" | "cancelled";
export type DateFilter = "all" | "7d" | "30d" | "3m";
export type PriceFilter = "all" | "lt20" | "20to50" | "gt50";

export type HistoryFilters = {
  status: StatusFilter;
  date: DateFilter;
  price: PriceFilter;
};

export const DEFAULT_FILTERS: HistoryFilters = {
  status: "all",
  date: "all",
  price: "all",
};

const STATUS_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "picked_up", label: "Récupérées" },
  { key: "cancelled", label: "Annulées" },
];

const DATE_OPTIONS: { key: DateFilter; label: string; days: number | null }[] = [
  { key: "all", label: "Tout", days: null },
  { key: "7d", label: "7 jours", days: 7 },
  { key: "30d", label: "30 jours", days: 30 },
  { key: "3m", label: "3 mois", days: 90 },
];

const PRICE_OPTIONS: {
  key: PriceFilter;
  label: string;
  min: number;
  max: number;
}[] = [
  { key: "all", label: "Tout", min: 0, max: Infinity },
  { key: "lt20", label: "< 20 €", min: 0, max: 20 },
  { key: "20to50", label: "20–50 €", min: 20, max: 50 },
  { key: "gt50", label: "> 50 €", min: 50, max: Infinity },
];

/** Count of dimensions that differ from "all" — used for the button badge. */
export function activeFilterCount(f: HistoryFilters): number {
  let n = 0;
  if (f.status !== "all") n += 1;
  if (f.date !== "all") n += 1;
  if (f.price !== "all") n += 1;
  return n;
}

/** Apply the committed filters to a list of past orders. */
export function filterOrders(orders: Order[], f: HistoryFilters): Order[] {
  const dateOpt = DATE_OPTIONS.find((o) => o.key === f.date);
  const priceOpt = PRICE_OPTIONS.find((o) => o.key === f.price);
  // `days` is a rolling window, so resolve the cutoff at call time.
  const cutoff =
    dateOpt?.days != null ? Date.now() - dateOpt.days * 24 * 60 * 60 * 1000 : null;

  return orders.filter((order) => {
    if (f.status !== "all" && order.status !== f.status) return false;
    if (cutoff != null && new Date(order.createdAt).getTime() < cutoff) {
      return false;
    }
    if (priceOpt) {
      // min inclusive, max exclusive so adjacent bands never double-count.
      if (order.totalEUR < priceOpt.min) return false;
      if (order.totalEUR >= priceOpt.max && priceOpt.max !== Infinity) {
        return false;
      }
    }
    return true;
  });
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        borderRadius: radius.pill,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderColor: active ? colors.ink : colors.border,
        backgroundColor: active ? colors.ink : colors.white,
      }}
    >
      <Text
        style={{
          fontFamily: font.bodySemi,
          fontSize: 13,
          color: active ? colors.white : colors.inkMuted,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          fontFamily: font.bodyBold,
          fontSize: 12,
          color: colors.inkMuted,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {title}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {children}
      </View>
    </View>
  );
}

export type HistoryFilterSheetProps = {
  visible: boolean;
  value: HistoryFilters;
  onClose: () => void;
  onApply: (filters: HistoryFilters) => void;
};

export default function HistoryFilterSheet({
  visible,
  value,
  onClose,
  onApply,
}: HistoryFilterSheetProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  // Draft state — edits only take effect on "Appliquer".
  const [draft, setDraft] = useState<HistoryFilters>(value);

  // Re-sync the draft with the committed filters whenever the sheet opens.
  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const set = <K extends keyof HistoryFilters>(
    key: K,
    v: HistoryFilters[K],
  ): void => {
    void Haptics.selectionAsync();
    setDraft((prev) => ({ ...prev, [key]: v }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          style={{ flex: 1 }}
          onPress={onClose}
        />
        <View
          style={[
            {
              backgroundColor: colors.white,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 24,
              paddingTop: 12,
              paddingBottom: insets.bottom + 16,
            },
            shadow.float,
          ]}
        >
          {/* Grabber */}
          <View
            style={{
              alignSelf: "center",
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.border,
              marginBottom: 16,
            }}
          />

          {/* Title */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: font.display,
                fontSize: 26,
                letterSpacing: 0.5,
                color: colors.ink,
              }}
            >
              FILTRER
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fermer"
              onPress={onClose}
              hitSlop={12}
            >
              <X size={24} color={colors.ink} strokeWidth={2.5} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 420 }}
          >
            <Section title="Statut">
              {STATUS_OPTIONS.map((o) => (
                <Chip
                  key={o.key}
                  label={o.label}
                  active={draft.status === o.key}
                  onPress={() => set("status", o.key)}
                />
              ))}
            </Section>

            <Section title="Période">
              {DATE_OPTIONS.map((o) => (
                <Chip
                  key={o.key}
                  label={o.label}
                  active={draft.date === o.key}
                  onPress={() => set("date", o.key)}
                />
              ))}
            </Section>

            <Section title="Montant">
              {PRICE_OPTIONS.map((o) => (
                <Chip
                  key={o.key}
                  label={o.label}
                  active={draft.price === o.key}
                  onPress={() => set("price", o.key)}
                />
              ))}
            </Section>
          </ScrollView>

          {/* Actions */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 24,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Réinitialiser les filtres"
              onPress={() => {
                void Haptics.selectionAsync();
                setDraft(DEFAULT_FILTERS);
              }}
              style={({ pressed }) => ({
                flex: 1,
                borderRadius: radius.pill,
                borderWidth: 1.5,
                borderColor: colors.border,
                paddingVertical: 16,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: font.bodyBold,
                  fontSize: 13,
                  color: colors.ink,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Réinitialiser
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Appliquer les filtres"
              onPress={() => {
                void Haptics.selectionAsync();
                onApply(draft);
                onClose();
              }}
              style={({ pressed }) => ({
                flex: 1.4,
                borderRadius: radius.pill,
                backgroundColor: colors.ink,
                paddingVertical: 16,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: font.bodyBold,
                  fontSize: 13,
                  color: colors.white,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Appliquer
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
