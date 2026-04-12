import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowRight, Clock, MapPin } from "lucide-react-native";

import FloatingCartBar from "@/components/cart/FloatingCartBar";
import Screen from "@/components/layout/Screen";
import CategoryChip from "@/components/menu/CategoryChip";
import ProductCard from "@/components/menu/ProductCard";
import { colors, font, radius, shadow, spacing } from "@/constants/theme";
import { CATEGORIES, getFeaturedProduct, PRODUCTS } from "@/data/menu";
import { useProfileStore } from "@/store/profile.store";
import { formatPriceEUR } from "@/lib/format";

export default function AccueilScreen(): React.ReactElement {
  const router = useRouter();
  const name = useProfileStore((s) => s.profile.name);

  const featured = useMemo(() => getFeaturedProduct(), []);
  const topPicks = useMemo(
    () => PRODUCTS.filter((p) => p.tags.includes("TOP")).slice(0, 6),
    [],
  );
  const newItems = useMemo(
    () => PRODUCTS.filter((p) => p.tags.includes("NOUVEAU")).slice(0, 4),
    [],
  );

  const greetingName = name === "Invité" ? "toi" : name;

  return (
    <Screen floatingBottom={<FloatingCartBar />}>
      {/* ── GREETING ── */}
      <View
        style={{
          backgroundColor: colors.white,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <MapPin size={14} color={colors.accent} strokeWidth={2.5} />
          <Text
            style={{
              fontFamily: font.bodySemi,
              fontSize: 13,
              color: colors.accent,
              letterSpacing: 0.5,
            }}
          >
            POP'S VILLEPINTE
          </Text>
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.inkMuted,
              marginHorizontal: 4,
            }}
          />
          <Clock size={13} color={colors.inkMuted} strokeWidth={2} />
          <Text
            style={{
              fontFamily: font.body,
              fontSize: 12,
              color: colors.inkMuted,
            }}
          >
            11h - 00h
          </Text>
        </View>

        <Text
          style={{
            fontFamily: font.display,
            fontSize: 48,
            lineHeight: 50,
            color: colors.ink,
            letterSpacing: 1,
          }}
        >
          Salam, {greetingName} !
        </Text>
        <Text
          style={{
            fontFamily: font.bodyMedium,
            fontSize: 16,
            color: colors.inkMuted,
            marginTop: 2,
          }}
        >
          Qu'est-ce qui te fait envie ?
        </Text>
      </View>

      {/* ── HERO BANNER ── */}
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Commander ${featured.name}`}
          onPress={() =>
            router.push({
              pathname: "/product/[id]",
              params: { id: featured.id },
            })
          }
          style={{
            backgroundColor: colors.primary,
            borderRadius: radius.lg,
            overflow: "hidden",
            ...shadow.hero,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              minHeight: 180,
            }}
          >
            {/* Left text */}
            <View
              style={{
                flex: 1,
                padding: 20,
                paddingRight: 8,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  backgroundColor: colors.ink,
                  alignSelf: "flex-start",
                  borderRadius: radius.pill,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: font.bodyBold,
                    fontSize: 10,
                    letterSpacing: 2,
                    color: colors.primary,
                    textTransform: "uppercase",
                  }}
                >
                  SIGNATURE
                </Text>
              </View>

              <Text
                numberOfLines={2}
                style={{
                  fontFamily: font.display,
                  fontSize: 32,
                  lineHeight: 34,
                  color: colors.ink,
                  letterSpacing: 0.5,
                }}
              >
                {featured.name}
              </Text>

              <Text
                numberOfLines={2}
                style={{
                  fontFamily: font.body,
                  fontSize: 13,
                  lineHeight: 18,
                  color: colors.cardDark,
                  marginTop: 6,
                  opacity: 0.7,
                }}
              >
                {featured.description}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 14,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.ink,
                    borderRadius: radius.pill,
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: font.bodyBold,
                      fontSize: 13,
                      color: colors.white,
                      letterSpacing: 0.5,
                    }}
                  >
                    COMMANDER
                  </Text>
                  <ArrowRight size={16} color={colors.white} strokeWidth={2.5} />
                </View>
                <Text
                  style={{
                    fontFamily: font.display,
                    fontSize: 26,
                    color: colors.ink,
                  }}
                >
                  {formatPriceEUR(featured.priceEUR)}
                </Text>
              </View>
            </View>

            {/* Right image */}
            <Image
              source={{ uri: featured.imageUrl }}
              contentFit="cover"
              style={{
                width: 150,
                height: "100%",
                borderTopRightRadius: radius.lg,
                borderBottomRightRadius: radius.lg,
              }}
              accessibilityIgnoresInvertColors
            />
          </View>
        </Pressable>
      </View>

      {/* ── CATEGORIES ── */}
      <View style={{ marginTop: 28 }}>
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
              fontFamily: font.display,
              fontSize: 28,
              color: colors.ink,
              letterSpacing: 0.5,
            }}
          >
            CATEGORIES
          </Text>
          <Text
            style={{
              fontFamily: font.bodySemi,
              fontSize: 13,
              color: colors.inkMuted,
            }}
          >
            {CATEGORIES.length} choix
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              onPress={() =>
                router.push({ pathname: "/menu", params: { cat: cat.id } })
              }
            />
          ))}
        </ScrollView>
      </View>

      {/* ── TOP PICKS ── */}
      <View style={{ marginTop: 28 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 14,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: font.display,
                fontSize: 28,
                color: colors.ink,
                letterSpacing: 0.5,
              }}
            >
              LES ENVIES DU MOMENT
            </Text>
            <Text
              style={{
                fontFamily: font.body,
                fontSize: 13,
                color: colors.inkMuted,
                marginTop: 2,
              }}
            >
              Notre selection de la semaine
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voir tout le menu"
            onPress={() => router.push("/menu")}
            style={{
              backgroundColor: colors.ink,
              borderRadius: radius.pill,
              paddingHorizontal: 14,
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                fontFamily: font.bodySemi,
                fontSize: 12,
                color: colors.white,
                letterSpacing: 0.5,
              }}
            >
              Voir tout
            </Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
        >
          {topPicks.map((p) => (
            <ProductCard key={p.id} product={p} size="md" />
          ))}
        </ScrollView>
      </View>

      {/* ── NOUVEAUTES ── */}
      <View style={{ marginTop: 28 }}>
        <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
          <View
            style={{
              backgroundColor: colors.accent,
              alignSelf: "flex-start",
              borderRadius: radius.pill,
              paddingHorizontal: 10,
              paddingVertical: 3,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontFamily: font.bodyBold,
                fontSize: 10,
                letterSpacing: 2,
                color: colors.white,
              }}
            >
              NOUVEAU
            </Text>
          </View>
          <Text
            style={{
              fontFamily: font.display,
              fontSize: 28,
              color: colors.ink,
              letterSpacing: 0.5,
            }}
          >
            NOUVEAUTES
          </Text>
          <Text
            style={{
              fontFamily: font.body,
              fontSize: 13,
              color: colors.inkMuted,
              marginTop: 2,
            }}
          >
            Fraichement arrives au comptoir
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 20,
            gap: 14,
          }}
        >
          {newItems.map((p) => (
            <View key={p.id} style={{ width: "47%" }}>
              <ProductCard product={p} size="sm" />
            </View>
          ))}
        </View>
      </View>

      {/* ── STORY / ABOUT ── */}
      <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
        <View
          style={{
            backgroundColor: colors.cardDark,
            borderRadius: radius.lg,
            padding: 24,
          }}
        >
          <Text
            style={{
              fontFamily: font.display,
              fontSize: 32,
              color: colors.primary,
              letterSpacing: 0.5,
            }}
          >
            POP'S VILLEPINTE
          </Text>
          <View
            style={{
              width: 40,
              height: 3,
              backgroundColor: colors.primary,
              marginVertical: 12,
              borderRadius: 2,
            }}
          />
          <Text
            style={{
              fontFamily: font.body,
              fontSize: 14,
              lineHeight: 22,
              color: colors.white,
              opacity: 0.85,
            }}
          >
            Abdoullah en cuisine, une cuisine de quartier faite main. Smash
            burgers, bowls, tacos — tout est pense pour que vous repartiez le
            coeur content.
          </Text>
          <Text
            style={{
              fontFamily: font.bodySemi,
              fontSize: 12,
              color: colors.primary,
              marginTop: 14,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Depuis 2024 - Fait maison
          </Text>
        </View>
      </View>

      {/* ── FOOTER ── */}
      <View
        style={{
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: 32,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 40,
            height: 3,
            backgroundColor: colors.primary,
            marginBottom: 12,
            borderRadius: 2,
          }}
        />
        <Text
          style={{
            fontFamily: font.bodySemi,
            fontSize: 11,
            letterSpacing: 2,
            textAlign: "center",
            color: colors.inkMuted,
            textTransform: "uppercase",
          }}
        >
          Ouvert 11h - 00h  |  06 51 30 XX XX
        </Text>
      </View>
    </Screen>
  );
}
