import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Search as SearchIcon } from "lucide-react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import Screen from "@/components/layout/Screen";
import CategoryRail, {
  type CategoryRailSelection,
} from "@/components/menu/CategoryRail";
import MenuSectionTitle from "@/components/menu/MenuSectionTitle";
import ProductRow from "@/components/menu/ProductRow";
import SearchField, { normalizeSearch } from "@/components/menu/SearchField";
import { colors } from "@/constants/theme";
import { CATEGORIES, PRODUCTS } from "@/data/menu";

export default function MenuScreen(): React.ReactElement {
  const params = useLocalSearchParams<{ cat?: string }>();
  const [selectedId, setSelectedId] = useState<CategoryRailSelection>(
    params.cat ?? "all",
  );
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [query, setQuery] = useState("");

  // Live updates from the home screen — tap a category chip there, land here pre-selected.
  useEffect(() => {
    if (params.cat !== undefined && params.cat !== selectedId) {
      setSelectedId(params.cat);
    }
    // Don't depend on selectedId — we only want this to react to URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.cat]);

  const isSearching = query.trim().length > 0;
  const normalizedQuery = useMemo(
    () => normalizeSearch(query.trim()),
    [query],
  );

  const filteredProducts = useMemo(() => {
    if (isSearching) {
      return PRODUCTS.filter(
        (p) =>
          normalizeSearch(p.name).includes(normalizedQuery) ||
          normalizeSearch(p.description).includes(normalizedQuery),
      );
    }
    if (selectedId === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.categoryId === selectedId);
  }, [isSearching, normalizedQuery, selectedId]);

  const groupedByCategory = useMemo(
    () =>
      CATEGORIES.slice()
        .sort((a, b) => a.order - b.order)
        .map((cat) => ({
          category: cat,
          products: PRODUCTS.filter((p) => p.categoryId === cat.id),
        }))
        .filter((g) => g.products.length > 0),
    [],
  );

  const handleToggleSearch = (): void => {
    if (searchExpanded) {
      setQuery("");
    }
    setSearchExpanded((v) => !v);
  };

  const selectedCategory =
    selectedId === "all"
      ? null
      : CATEGORIES.find((c) => c.id === selectedId) ?? null;

  return (
    <Screen stickyHeaderIndices={[1]}>
      {/* [0] Top editorial header */}
      <View
        className="flex-row items-start justify-between"
        style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}
      >
        {!searchExpanded ? (
          <View className="flex-1 pr-4">
            <Text
              className="font-sans-semibold text-on-surface-variant uppercase"
              style={{ fontSize: 11, letterSpacing: 3 }}
            >
              La Carte
            </Text>
            <Text
              className="font-sans-extrabold-italic text-on-surface"
              style={{
                fontSize: 44,
                lineHeight: 48,
                letterSpacing: -1.5,
                marginTop: 4,
              }}
            >
              Menu
            </Text>
            <Text
              className="font-sans text-on-surface-variant"
              style={{ fontSize: 13, marginTop: 4 }}
            >
              {CATEGORIES.length} catégories · {PRODUCTS.length} créations
            </Text>
          </View>
        ) : null}

        <View
          className={searchExpanded ? "flex-1" : ""}
          style={{ paddingTop: searchExpanded ? 0 : 8 }}
        >
          <SearchField
            value={query}
            onChangeText={setQuery}
            expanded={searchExpanded}
            onToggle={handleToggleSearch}
          />
        </View>
      </View>

      {/* [1] Sticky category rail (collapses to a thin spacer while searching) */}
      <View className="bg-surface">
        {!isSearching ? (
          <CategoryRail selectedId={selectedId} onSelect={setSelectedId} />
        ) : (
          <View style={{ height: 8 }} />
        )}
      </View>

      {/* [2] Content */}
      {isSearching ? (
        <View style={{ paddingTop: 16 }}>
          {filteredProducts.length === 0 ? (
            <View
              className="items-center"
              style={{ paddingVertical: 96, paddingHorizontal: 32 }}
            >
              <SearchIcon
                size={48}
                color={colors.onSurfaceVariant}
                strokeWidth={1.5}
              />
              <Text
                className="font-sans-extrabold-italic text-on-surface"
                style={{ fontSize: 24, letterSpacing: -0.5, marginTop: 24 }}
              >
                Rien trouvé
              </Text>
              <Text
                className="font-sans text-on-surface-variant"
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Essayez un autre mot ou parcourez une catégorie.
              </Text>
            </View>
          ) : (
            <Animated.View layout={LinearTransition.duration(200)}>
              {filteredProducts.map((p, idx) => (
                <ProductRow key={p.id} product={p} index={idx} />
              ))}
            </Animated.View>
          )}
        </View>
      ) : selectedId === "all" ? (
        <View>
          {groupedByCategory.map(({ category, products }, catIdx) => (
            <View
              key={category.id}
              className={catIdx % 2 === 1 ? "bg-surface-container-low" : "bg-surface"}
            >
              <MenuSectionTitle name={category.name} count={products.length} />
              {products.map((p, idx) => (
                <ProductRow key={p.id} product={p} index={idx} />
              ))}
              <View style={{ height: 32 }} />
            </View>
          ))}
        </View>
      ) : selectedCategory !== null ? (
        <View>
          <MenuSectionTitle
            name={selectedCategory.name}
            count={filteredProducts.length}
          />
          {filteredProducts.map((p, idx) => (
            <ProductRow key={p.id} product={p} index={idx} />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}
