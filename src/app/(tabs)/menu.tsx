import { useEffect, useMemo, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Search as SearchIcon } from "lucide-react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import FloatingCartBar from "@/components/cart/FloatingCartBar";
import Screen from "@/components/layout/Screen";
import CategoryRail, {
  type CategoryRailSelection,
} from "@/components/menu/CategoryRail";
import MenuSectionTitle from "@/components/menu/MenuSectionTitle";
import ProductRow from "@/components/menu/ProductRow";
import SearchField, { normalizeSearch } from "@/components/menu/SearchField";
import { colors, font, radius } from "@/constants/theme";
import { CATEGORIES, PRODUCTS } from "@/data/menu";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const burgerIll = require("../../../assets/images/burgerillustartion.png") as number;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const friesIll = require("../../../assets/images/friesillustartion.png") as number;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tacosIll = require("../../../assets/images/tacosillustartion.png") as number;

const { width: SW } = Dimensions.get("window");

const ICONS = [burgerIll, friesIll, tacosIll];
const ROTATIONS = [-10, 14, -6, 18, -12, 8, -16, 10, -4, 20, -8, 12, -14, 6, -18, 16];

function FoodPatternBg(): React.ReactElement {
  const rows = 12;
  const cols = Math.ceil(SW / 38);
  const items: React.ReactElement[] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const src = ICONS[idx % ICONS.length]!;
      const rot = ROTATIONS[idx % ROTATIONS.length]!;
      items.push(
        <Image
          key={`${r}-${c}`}
          source={src}
          contentFit="contain"
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            top: r * 60 + (c % 2 === 0 ? 0 : 30),
            left: c * 38 + (r % 2 === 0 ? 0 : 18),
            transform: [{ rotate: `${rot}deg` }],
            opacity: 0.2,
          }}
        />,
      );
      idx++;
    }
  }
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: rows * 60 + 40,
      }}
    >
      {items}
    </View>
  );
}

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
    <Screen
      stickyHeaderIndices={[1]}
      floatingBottom={<FloatingCartBar />}
    >
      {/* [0] Header */}
      <View
        style={{
          backgroundColor: colors.white,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 8,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        {!searchExpanded ? (
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text
              style={{
                fontFamily: font.display,
                fontSize: 48,
                lineHeight: 50,
                color: colors.ink,
                letterSpacing: 1,
              }}
            >
              MENU
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: radius.pill,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text
                  style={{
                    fontFamily: font.bodyBold,
                    fontSize: 11,
                    color: colors.ink,
                    letterSpacing: 1,
                  }}
                >
                  {CATEGORIES.length} categories
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: font.bodyMedium,
                  fontSize: 13,
                  color: colors.inkMuted,
                }}
              >
                {PRODUCTS.length} produits
              </Text>
            </View>
          </View>
        ) : null}

        <View
          style={
            searchExpanded
              ? { flex: 1 }
              : { paddingTop: 8 }
          }
        >
          <SearchField
            value={query}
            onChangeText={setQuery}
            expanded={searchExpanded}
            onToggle={handleToggleSearch}
          />
        </View>
      </View>

      {/* [1] Sticky category rail */}
      <View style={{ backgroundColor: colors.white }}>
        {!isSearching ? (
          <CategoryRail selectedId={selectedId} onSelect={setSelectedId} />
        ) : (
          <View style={{ height: 8, backgroundColor: colors.white }} />
        )}
      </View>

      {/* [2] Content with food pattern background */}
      <View style={{ position: "relative" }}>
        <FoodPatternBg />
      {isSearching ? (
        <View style={{ paddingTop: 16 }}>
          {filteredProducts.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 80,
                paddingHorizontal: 32,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <SearchIcon
                  size={36}
                  color={colors.ink}
                  strokeWidth={2}
                />
              </View>
              <Text
                style={{
                  fontFamily: font.display,
                  fontSize: 28,
                  color: colors.ink,
                  letterSpacing: 0.5,
                }}
              >
                RIEN TROUVE
              </Text>
              <Text
                style={{
                  fontFamily: font.body,
                  fontSize: 14,
                  lineHeight: 22,
                  marginTop: 8,
                  textAlign: "center",
                  color: colors.inkMuted,
                }}
              >
                Essayez un autre mot ou parcourez une categorie.
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
              style={{
                backgroundColor:
                  catIdx % 2 === 1 ? "#F8F8F5" : colors.white,
              }}
            >
              <MenuSectionTitle name={category.name} count={products.length} />
              {products.map((p, idx) => (
                <ProductRow key={p.id} product={p} index={idx} />
              ))}
              <View style={{ height: 24 }} />
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
      </View>
    </Screen>
  );
}
