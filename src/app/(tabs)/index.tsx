import { useEffect, useMemo, useRef } from "react";
import { Animated as RNAnimated, Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowRight, Heart } from "lucide-react-native";

import FloatingCartBar from "@/components/cart/FloatingCartBar";
import Screen from "@/components/layout/Screen";
import CategoryChip from "@/components/menu/CategoryChip";
import { colors, font, radius, shadow } from "@/constants/theme";
import { CATEGORIES, getFeaturedProduct, PRODUCTS } from "@/data/menu";
import { formatPriceEUR } from "@/lib/format";
import { useProfileStore } from "@/store/profile.store";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoImage = require("../../../assets/images/logo.png") as number;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const burgerIll = require("../../../assets/images/burgerillustartion.png") as number;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const friesIll = require("../../../assets/images/friesillustartion.png") as number;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tacosIll = require("../../../assets/images/tacosillustartion.png") as number;

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
      {/* ── LOGO + FOOD PATTERN ── */}
      <View style={{ height: 80, overflow: "visible", position: "relative", marginTop: -50 }}>
        {/* Dense tiny food illustration pattern — extends under status bar */}
        <View pointerEvents="none" style={{ position: "absolute", top: -20, left: 0, right: 0, bottom: 0 }}>
          {/* Row 0 — under status bar */}
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: -16, left: 14, transform: [{ rotate: "8deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: -12, left: 50, transform: [{ rotate: "-14deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: -18, left: 84, transform: [{ rotate: "10deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 24, height: 24, top: -10, left: 116, transform: [{ rotate: "-6deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: -16, left: 150, transform: [{ rotate: "16deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: -12, left: 182, transform: [{ rotate: "-8deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: -18, left: 216, transform: [{ rotate: "12deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 24, height: 24, top: -10, left: 248, transform: [{ rotate: "-10deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: -16, left: 280, transform: [{ rotate: "6deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: -12, left: 312, transform: [{ rotate: "-16deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: -18, left: 346, transform: [{ rotate: "14deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: -10, left: 374, transform: [{ rotate: "-8deg" }], opacity: 0.25 }} />
          {/* Row 1 */}
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 4, left: 8, transform: [{ rotate: "-10deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: 10, left: 38, transform: [{ rotate: "15deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: 2, left: 66, transform: [{ rotate: "-5deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 24, height: 24, top: 8, left: 94, transform: [{ rotate: "20deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: 4, left: 126, transform: [{ rotate: "-12deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 12, left: 152, transform: [{ rotate: "8deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: 2, left: 182, transform: [{ rotate: "-18deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 10, left: 210, transform: [{ rotate: "12deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: 4, left: 240, transform: [{ rotate: "-8deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 24, height: 24, top: 8, left: 268, transform: [{ rotate: "14deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: 2, left: 298, transform: [{ rotate: "-6deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 10, left: 326, transform: [{ rotate: "18deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: 4, left: 356, transform: [{ rotate: "-14deg" }], opacity: 0.25 }} />
          {/* Row 2 */}
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: 30, left: 2, transform: [{ rotate: "12deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 34, left: 30, transform: [{ rotate: "-8deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: 28, left: 60, transform: [{ rotate: "16deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 24, height: 24, top: 36, left: 86, transform: [{ rotate: "-12deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: 28, left: 118, transform: [{ rotate: "6deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 34, left: 146, transform: [{ rotate: "-15deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: 30, left: 176, transform: [{ rotate: "10deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 24, height: 24, top: 36, left: 202, transform: [{ rotate: "-6deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: 28, left: 234, transform: [{ rotate: "18deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 32, left: 262, transform: [{ rotate: "-10deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: 28, left: 292, transform: [{ rotate: "8deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 24, height: 24, top: 34, left: 318, transform: [{ rotate: "-16deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: 30, left: 350, transform: [{ rotate: "14deg" }], opacity: 0.25 }} />
          {/* Row 3 */}
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 56, left: 12, transform: [{ rotate: "-14deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: 60, left: 42, transform: [{ rotate: "10deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 24, height: 24, top: 54, left: 70, transform: [{ rotate: "-6deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: 62, left: 102, transform: [{ rotate: "18deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 56, left: 130, transform: [{ rotate: "-8deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: 60, left: 160, transform: [{ rotate: "12deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 24, height: 24, top: 54, left: 186, transform: [{ rotate: "-16deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: 62, left: 218, transform: [{ rotate: "6deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 56, left: 246, transform: [{ rotate: "-12deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 18, height: 18, top: 60, left: 276, transform: [{ rotate: "14deg" }], opacity: 0.25 }} />
          <Image source={tacosIll} contentFit="contain" style={{ position: "absolute", width: 24, height: 24, top: 54, left: 304, transform: [{ rotate: "-10deg" }], opacity: 0.25 }} />
          <Image source={burgerIll} contentFit="contain" style={{ position: "absolute", width: 20, height: 20, top: 58, left: 336, transform: [{ rotate: "8deg" }], opacity: 0.25 }} />
          <Image source={friesIll} contentFit="contain" style={{ position: "absolute", width: 22, height: 22, top: 56, left: 364, transform: [{ rotate: "-18deg" }], opacity: 0.25 }} />
        </View>
        {/* Logo centered on top */}
        <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", paddingBottom: 4, zIndex: 10 }}>
          <Image
            source={logoImage}
            contentFit="contain"
            style={{ width: 50, height: 50 }}
          />
        </View>
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
                source={{ uri: featured.imageUrl }}
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
                  {formatPriceEUR(featured.priceEUR)}
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
                  source={{ uri: p.imageUrl }}
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
                  {formatPriceEUR(p.priceEUR)}
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
                  source={{ uri: p.imageUrl }}
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
                    {formatPriceEUR(p.priceEUR)}
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
