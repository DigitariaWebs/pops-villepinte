import { useEffect, useMemo, useRef } from "react";
import { ScrollView, View } from "react-native";

import CategoryChip from "@/components/menu/CategoryChip";
import { CATEGORIES } from "@/data/menu";
import type { Category } from "@/types";

export type CategoryRailSelection = string | "all";

export type CategoryRailProps = {
  selectedId: CategoryRailSelection;
  onSelect: (id: CategoryRailSelection) => void;
};

const ALL_CATEGORY: Category = {
  id: "all",
  name: "Tout",
  icon: "grid",
  order: 0,
};

export default function CategoryRail({
  selectedId,
  onSelect,
}: CategoryRailProps): React.ReactElement {
  const scrollRef = useRef<ScrollView | null>(null);
  // Per-chip x position. Index 0 is the synthetic "Tout" chip.
  const offsetsRef = useRef<number[]>([]);

  const items = useMemo<readonly Category[]>(
    () => [
      ALL_CATEGORY,
      ...CATEGORIES.slice().sort((a, b) => a.order - b.order),
    ],
    [],
  );

  const selectedIndex = useMemo(
    () => items.findIndex((c) => c.id === selectedId),
    [items, selectedId],
  );

  useEffect(() => {
    if (selectedIndex < 0) return;
    const x = offsetsRef.current[selectedIndex];
    if (x === undefined) return;
    // Bias slightly so the active chip isn't flush against the leading edge.
    scrollRef.current?.scrollTo({ x: Math.max(0, x - 24), animated: true });
  }, [selectedIndex]);

  return (
    <View className="bg-surface">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 12,
          gap: 10,
        }}
      >
        {items.map((cat, index) => (
          <View
            key={cat.id}
            onLayout={(e) => {
              offsetsRef.current[index] = e.nativeEvent.layout.x;
            }}
          >
            <CategoryChip
              category={cat}
              selected={cat.id === selectedId}
              onPress={() => onSelect(cat.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
