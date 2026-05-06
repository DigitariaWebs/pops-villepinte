import { useEffect, useMemo, useRef } from "react";
import { Animated as RNAnimated, Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowRight, Heart } from "lucide-react-native";

import FloatingCartBar from "@/components/cart/FloatingCartBar";
import Screen from "@/components/layout/Screen";
import CategoryChip from "@/components/menu/CategoryChip";
import { colors, font, radius, shadow } from "@/constants/theme";
import { formatPriceEUR } from "@/lib/format";
import { useMenuStore } from "@/store/menu.store";
import { useProfileStore } from "@/store/profile.store";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoImage = require("../../../assets/images/pops-logo.png") as number;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 20 * 2 - 12) / 2;

const MARQUEE_TEXT =
  "   FAIT MAISON 🔥   SMASH BURGERS   TACOS   BOWLS   WRAPS   DU PEUPLE POUR LE PEUPLE 💛   VILLEPINTE 93   VIENS RÉCUPÉRER   CASH OU CB   ";
const MARQUEE_DOUBLE = MARQUEE_TEXT + MARQUEE_TEXT;

function MarqueeTape(): React.ReactElement {
  const translateX = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const anim = RNAnimated.loop(
      RNAnimated.timing(translateX, {
        toValue: -SCREEN_WIDTH * 2,
        duration: 18000,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [translateX]);

  return (
    <View
      style={{
        overflow: "hidden",
        backgroundColor: colors.accent,
        height: 28,
        justifyContent: "center",
        marginTop: 14,
      }}
    >
      <RNAnimated.View
        style={{
          flexDirection: "row",
          transform: [{ translateX }],
        }}
      >
        <Text
          style={{
            fontFamily: font.display,
            fontSize: 12,
            letterSpacing: 2,
            color: colors.primary,
            width: SCREEN_WIDTH * 4,
          }}
        >
          {MARQUEE_DOUBLE}
        </Text>
      </RNAnimated.View>
    </View>
  );
}

export default function AccueilScreen(): React.ReactElement {
  const router = useRouter();
  const name = useProfileStore((s) => s.profile.name);
  const PRODUCTS = useMenuStore((s) => s.products);
  const CATEGORIES = useMenuStore((s) => s.categories);

  const featured = useMemo(() => PRODUCTS.find((p) => p.tags.includes("TOP")) ?? PRODUCTS[0], [PRODUCTS]);
  const topPicks = useMemo(
    () => PRODUCTS.filter((p) => p.tags.includes("TOP")).slice(0, 6),
    [PRODUCTS],
  );
  const newItems = useMemo(
    () => PRODUCTS.filter((p) => p.tags.includes("NOUVEAU")).slice(0, 4),
    [PRODUCTS],
  );

  const greetingName = name === "Invité" ? "toi" : name;

  return (
    <Screen floatingBottom={<FloatingCartBar />}>
      {/* ── LOGO ── */}
      <View
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={logoImage}
          contentFit="contain"
          style={{ width: 50, height: 50 }}
        />
      </View>

      {/* ── GREETING ── */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 4 }}>
        <Text
          style={{
            fontFamily: font.display,
            fontSize: 42,
            lineHeight: 44,
            color: colors.ink,
            letterSpacing: 1,
          }}
        >
          Salam, {greetingName} !
        </Text>
        <Text
          style={{
            fontFamily: font.body,
            fontSize: 14,
            color: colors.inkMuted,
            marginTop: 2,
          }}
        >
          Qu'est-ce qui te fait envie ?
        </Text>
      </View>

      {/* ── MARQUEE TAPE ── */}
      <MarqueeTape />

      {/* ── HERO BANNER ── */}
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Commander ${featured.name}`}
          onPress={() =>
            router.push({ pathname: "/product/[id]", params: { id: featured.id } })
          }
          style={{
            backgroundColor: colors.primary,
            borderRadius: radius.xl,
            overflow: "hidden",
            ...shadow.hero,
          }}
        >
          <View style={{ flexDirection: "row", height: 200 }}>
            {/* Left content */}
            <View
              style={{
                flex: 1,
                padding: 20,
                justifyContent: "space-between",
              }}
            >
              <View>
                <View
                  style={{
                    backgroundColor: colors.ink,
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
                      fontSize: 9,
                      letterSpacing: 2,
                      color: colors.primary,
                    }}
                  >
                    SIGNATURE
                  </Text>
                </View>

                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: font.display,
                    fontSize: 36,
                    lineHeight: 38,
                    color: colors.ink,
                    letterSpacing: 1,
                  }}
                >
                  {featured.name.toUpperCase()}
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: font.body,
                    fontSize: 12,
                    lineHeight: 16,
                    color: "rgba(0,0,0,0.55)",
                    marginTop: 4,
                  }}
                >
                  {featured.description}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: colors.ink,
                  alignSelf: "flex-start",
                  borderRadius: radius.pill,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: font.bodyBold,
                    fontSize: 12,
                    color: colors.white,
                    letterSpacing: 0.5,
                  }}
                >
                  COMMANDER
                </Text>
                <ArrowRight size={14} color={colors.white} strokeWidth={2.5} />
              </View>
            </View>

            {/* Right image with price overlay */}
            <View style={{ width: "42%", position: "relative" }}>
              <Image
                source={featured?.image_url}
                contentFit="cover"
                style={{ width: "100%", height: "100%" }}
                accessibilityIgnoresInvertColors
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  backgroundColor: colors.primary,
                  borderRadius: radius.sm,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: font.display,
                    fontSize: 22,
                    color: colors.ink,
                  }}
                >
                  {formatPriceEUR(featured?.price_eur ?? 0)}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>

      {/* ── CATEGORIES ── */}
      <View style={{ marginTop: 24 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontFamily: font.display,
              fontSize: 24,
              color: colors.ink,
              letterSpacing: 0.5,
            }}
          >
            CATEGORIES
          </Text>
          <Text
            style={{
              fontFamily: font.bodySemi,
              fontSize: 12,
              color: colors.inkMuted,
            }}
          >
            {CATEGORIES.length} choix
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
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
      <View style={{ marginTop: 24 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 12,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: font.display,
                fontSize: 24,
                color: colors.ink,
                letterSpacing: 0.5,
              }}
            >
              LES ENVIES DU MOMENT
            </Text>
            <Text
              style={{
                fontFamily: font.body,
                fontSize: 12,
                color: colors.inkMuted,
                marginTop: 1,
              }}
            >
              Notre sélection de la semaine
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voir tout le menu"
            onPress={() => router.push("/menu")}
            style={{
              borderRadius: radius.pill,
              borderWidth: 1.5,
              borderColor: colors.ink,
              paddingHorizontal: 14,
              paddingVertical: 7,
            }}
          >
            <Text
              style={{
                fontFamily: font.bodySemi,
                fontSize: 12,
                color: colors.ink,
              }}
            >
              Voir tout
            </Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        >
          {topPicks.map((p) => (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              onPress={() =>
                router.push({ pathname: "/product/[id]", params: { id: p.id } })
              }
              style={{
                width: CARD_WIDTH,
                borderRadius: radius.lg,
                overflow: "hidden",
                backgroundColor: colors.white,
                ...shadow.card,
              }}
            >
              <View style={{ position: "relative" }}>
                <Image
                  source={p.image_url}
                  contentFit="cover"
                  style={{
                    width: "100%",
                    height: CARD_WIDTH * 0.85,
                    borderTopLeftRadius: radius.lg,
                    borderTopRightRadius: radius.lg,
                  }}
                  accessibilityIgnoresInvertColors
                />
                <View
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Heart size={16} color={colors.ink} strokeWidth={2} />
                </View>
              </View>
              <View style={{ padding: 12 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: font.bodySemi,
                    fontSize: 15,
                    color: colors.ink,
                  }}
                >
                  {p.name}
                </Text>
                <Text
                  style={{
                    fontFamily: font.bodyBold,
                    fontSize: 16,
                    color: colors.ink,
                    marginTop: 4,
                  }}
                >
                  {formatPriceEUR(p.price_eur)}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ── NOUVEAUTES ── */}
      {newItems.length > 0 ? (
        <View style={{ marginTop: 24 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
            <Text
              style={{
                fontFamily: font.display,
                fontSize: 24,
                color: colors.ink,
                letterSpacing: 0.5,
              }}
            >
              NOUVEAUTÉS
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {newItems.map((p) => (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                onPress={() =>
                  router.push({ pathname: "/product/[id]", params: { id: p.id } })
                }
                style={{
                  width: CARD_WIDTH,
                  borderRadius: radius.lg,
                  overflow: "hidden",
                  backgroundColor: colors.white,
                  ...shadow.card,
                }}
              >
                <Image
                  source={p.image_url}
                  contentFit="cover"
                  style={{
                    width: "100%",
                    height: CARD_WIDTH * 0.85,
                    borderTopLeftRadius: radius.lg,
                    borderTopRightRadius: radius.lg,
                  }}
                  accessibilityIgnoresInvertColors
                />
                <View style={{ padding: 12 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: font.bodySemi,
                      fontSize: 15,
                      color: colors.ink,
                    }}
                  >
                    {p.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: font.bodyBold,
                      fontSize: 16,
                      color: colors.ink,
                      marginTop: 4,
                    }}
                  >
                    {formatPriceEUR(p.price_eur)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* ── STORY ── */}
      <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
        <View
          style={{
            backgroundColor: colors.cardDark,
            borderRadius: radius.lg,
            padding: 22,
          }}
        >
          <Text
            style={{
              fontFamily: font.display,
              fontSize: 28,
              color: colors.primary,
              letterSpacing: 0.5,
            }}
          >
            POP'S VILLEPINTE
          </Text>
          <View
            style={{
              width: 36,
              height: 3,
              backgroundColor: colors.primary,
              marginVertical: 10,
              borderRadius: 2,
            }}
          />
          <Text
            style={{
              fontFamily: font.body,
              fontSize: 13,
              lineHeight: 20,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Abdoullah en cuisine, fait maison chaque jour. Smash burgers, bowls,
            tacos — du peuple, pour le peuple.
          </Text>
        </View>
      </View>

      {/* ── FOOTER ── */}
      <View
        style={{
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: 28,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 36,
            height: 3,
            backgroundColor: colors.primary,
            marginBottom: 10,
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
          Ouvert 11h – 00h · 06 51 30 XX XX
        </Text>
      </View>
    </Screen>
  );
}
