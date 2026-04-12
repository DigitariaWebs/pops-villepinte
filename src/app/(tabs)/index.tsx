import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

import FloatingCartBar from "@/components/cart/FloatingCartBar";
import CravingCard from "@/components/home/CravingCard";
import Greeting from "@/components/home/Greeting";
import SectionHeader from "@/components/home/SectionHeader";
import StoryCard from "@/components/home/StoryCard";
import Screen from "@/components/layout/Screen";
import CategoryChip from "@/components/menu/CategoryChip";
import ProductCard from "@/components/menu/ProductCard";
import { colors } from "@/constants/theme";
import { CATEGORIES, getFeaturedProduct, PRODUCTS } from "@/data/menu";
import { useProfileStore } from "@/store/profile.store";

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

  const greetingName = name === "Invité" ? "vous" : name;

  return (
    <Screen floatingBottom={<FloatingCartBar />}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <Greeting name={greetingName} />
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        <CravingCard product={featured} />
      </View>

      <SectionHeader title="Catégories" subtitle="Faites votre choix" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
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

      <SectionHeader
        title="Les envies du moment"
        subtitle="Notre sélection de la semaine"
        actionLabel="Voir tout"
        onActionPress={() => router.push("/menu")}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
      >
        {topPicks.map((p) => (
          <ProductCard key={p.id} product={p} size="md" />
        ))}
      </ScrollView>

      <SectionHeader
        title="Nouveautés"
        subtitle="Fraîchement arrivés au comptoir"
      />
      <View
        className="flex-row flex-wrap"
        style={{ paddingHorizontal: 24, gap: 16 }}
      >
        {newItems.map((p) => (
          <View key={p.id} style={{ width: "47%" }}>
            <ProductCard product={p} size="sm" />
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
        <StoryCard />
      </View>

      <View
        className="items-center"
        style={{ paddingHorizontal: 24, marginTop: 32, marginBottom: 16 }}
      >
        <View
          style={{
            width: 32,
            height: 2,
            backgroundColor: colors.editorialRule,
            marginBottom: 16,
          }}
        />
        <Text
          className="font-sans-semibold text-on-surface-variant uppercase"
          style={{ fontSize: 10, letterSpacing: 3, textAlign: "center" }}
        >
          Ouvert 11h – 00h · 06 51 30 XX XX
        </Text>
      </View>
    </Screen>
  );
}
