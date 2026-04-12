import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  type ViewToken,
} from "react-native";
import { ChevronRight, MapPin, ShoppingBag, UtensilsCrossed } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Slide = {
  id: string;
  icon: typeof UtensilsCrossed;
  title: string;
  body: string;
  bg: string;
};

const SLIDES: Slide[] = [
  {
    id: "1",
    icon: UtensilsCrossed,
    title: "BIENVENUE\nCHEZ POP'S",
    body: "Smash burgers, tacos, bowls — fait maison à Villepinte. Du peuple, pour le peuple.",
    bg: colors.primary,
  },
  {
    id: "2",
    icon: ShoppingBag,
    title: "COMMANDE\nEN 30 SEC",
    body: "Choisis ton plat, personnalise-le avec tes suppléments, et valide. C'est tout.",
    bg: colors.accent,
  },
  {
    id: "3",
    icon: MapPin,
    title: "VIENS\nRÉCUPÉRER",
    body: "Ta commande est prête quand tu arrives. Pas de file, pas d'attente. Cash ou CB.",
    bg: colors.ink,
  },
];

export type OnboardingFlowProps = {
  onComplete: () => void;
};

export default function OnboardingFlow({
  onComplete,
}: OnboardingFlowProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0]?.index !== null) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isLast = currentIndex === SLIDES.length - 1;

  const handleNext = (): void => {
    void Haptics.selectionAsync();
    if (isLast) {
      onComplete();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = (): void => {
    void Haptics.selectionAsync();
    onComplete();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <View
              style={{
                width: SCREEN_WIDTH,
                flex: 1,
                backgroundColor: item.bg,
                paddingHorizontal: 32,
                paddingTop: insets.top + 60,
                paddingBottom: insets.bottom + 120,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 32,
                }}
              >
                <Icon
                  size={40}
                  color={item.bg === colors.ink ? colors.primary : colors.ink}
                  strokeWidth={2.5}
                />
              </View>

              <Text
                style={{
                  fontFamily: "BebasNeue_400Regular",
                  fontSize: 56,
                  lineHeight: 58,
                  letterSpacing: 2,
                  color: item.bg === colors.ink ? colors.primary : colors.ink,
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                  fontSize: 16,
                  lineHeight: 24,
                  color:
                    item.bg === colors.ink
                      ? "rgba(255,255,255,0.75)"
                      : "rgba(0,0,0,0.65)",
                  marginTop: 20,
                  maxWidth: 300,
                }}
              >
                {item.body}
              </Text>
            </View>
          );
        }}
      />

      {/* Bottom controls */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 32,
          paddingBottom: insets.bottom + 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={handleSkip} hitSlop={16}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Passer
          </Text>
        </Pressable>

        {/* Dots */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  i === currentIndex ? colors.primary : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronRight size={28} color={colors.ink} strokeWidth={3} />
        </Pressable>
      </View>
    </View>
  );
}
