import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Package, SlidersHorizontal } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import IconButton from "@/components/common/IconButton";
import HistoryFilterSheet, {
  activeFilterCount,
  DEFAULT_FILTERS,
  filterOrders,
  type HistoryFilters,
} from "@/components/orders/HistoryFilterSheet";
import OrderDetailsSheet from "@/components/orders/OrderDetailsSheet";
import PastOrderRow from "@/components/orders/PastOrderRow";
import { ROUTES } from "@/constants/routes";
import { colors, font, radius } from "@/constants/theme";
import { useCartStore } from "@/store/cart.store";
import { useOrdersStore } from "@/store/orders.store";
import { useProfileStore } from "@/store/profile.store";
import type { Order } from "@/types";

export default function OrderHistoryScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const history = useOrdersStore((s) => s.history);
  const addItem = useCartStore((s) => s.addItem);
  const profilePhone = useProfileStore((s) => s.profile.phone);

  const [filters, setFilters] = useState<HistoryFilters>(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);

  const activeCount = activeFilterCount(filters);
  const filtered = useMemo(
    () => filterOrders(history, filters),
    [history, filters],
  );

  const handleReorder = useCallback(
    (order: Order) => {
      void Haptics.selectionAsync();
      for (const item of order.items) {
        addItem({
          productId: item.productId,
          accompagnementId: item.accompagnementId,
          variantId: item.variantId,
          quantity: item.quantity,
          supplements: item.supplements,
          notes: item.notes,
        });
      }
      router.push(ROUTES.cart);
    },
    [addItem, router],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Top bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 8,
          }}
        >
          <IconButton
            icon={ArrowLeft}
            variant="light"
            onPress={() => router.back()}
            accessibilityLabel="Retour"
          />
          <View style={{ width: 44 }} />
        </View>

        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <Package size={16} color={colors.primary} strokeWidth={2.5} />
            <Text
              style={{
                fontFamily: font.bodySemi,
                fontSize: 13,
                color: colors.primary,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Historique complet
            </Text>
          </View>
          <Text
            style={{
              fontFamily: font.display,
              fontSize: 44,
              lineHeight: 46,
              color: colors.ink,
              letterSpacing: 1,
            }}
          >
            TOUTES MES COMMANDES
          </Text>
        </View>

        {/* Filter bar: result count + filter button */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontFamily: font.bodySemi,
              fontSize: 13,
              color: colors.inkMuted,
            }}
          >
            {filtered.length} commande{filtered.length > 1 ? "s" : ""}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filtrer les commandes"
            onPress={() => {
              void Haptics.selectionAsync();
              setFilterOpen(true);
            }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: activeCount > 0 ? colors.ink : "#F2F2EF",
              borderRadius: radius.pill,
              paddingHorizontal: 16,
              paddingVertical: 10,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <SlidersHorizontal
              size={16}
              color={activeCount > 0 ? colors.white : colors.ink}
              strokeWidth={2.5}
            />
            <Text
              style={{
                fontFamily: font.bodyBold,
                fontSize: 13,
                color: activeCount > 0 ? colors.white : colors.ink,
                letterSpacing: 0.5,
              }}
            >
              Filtrer
            </Text>
            {activeCount > 0 ? (
              <View
                style={{
                  minWidth: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: font.bodyBold,
                    fontSize: 11,
                    color: colors.ink,
                  }}
                >
                  {activeCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        {/* List */}
        {filtered.length > 0 ? (
          <View style={{ gap: 14 }}>
            {filtered.map((order) => (
              <PastOrderRow
                key={order.id}
                order={order}
                onReorder={() => handleReorder(order)}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setDetailsOrder(order);
                }}
              />
            ))}
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 32,
              paddingVertical: 48,
              gap: 16,
            }}
          >
            <Text
              style={{
                fontFamily: font.bodySemi,
                fontSize: 15,
                color: colors.inkMuted,
                textAlign: "center",
              }}
            >
              {activeCount > 0
                ? "Aucune commande ne correspond à ces filtres."
                : "Aucune commande pour le moment."}
            </Text>
            {activeCount > 0 ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  void Haptics.selectionAsync();
                  setFilters(DEFAULT_FILTERS);
                }}
                hitSlop={8}
              >
                <Text
                  style={{
                    fontFamily: font.bodySemi,
                    fontSize: 13,
                    color: colors.primary,
                    textDecorationLine: "underline",
                  }}
                >
                  Réinitialiser les filtres
                </Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </ScrollView>

      <HistoryFilterSheet
        visible={filterOpen}
        value={filters}
        onClose={() => setFilterOpen(false)}
        onApply={setFilters}
      />

      <OrderDetailsSheet
        order={detailsOrder}
        visible={detailsOrder !== null}
        onClose={() => setDetailsOrder(null)}
        onReorder={(o) => {
          setDetailsOrder(null);
          handleReorder(o);
        }}
        customerPhone={profilePhone}
      />
    </View>
  );
}
