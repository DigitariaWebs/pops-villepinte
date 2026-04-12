import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import IconButton from "@/components/common/IconButton";
import Toast from "@/components/common/Toast";
import NotesField from "@/components/menu/NotesField";
import QuantityStepper from "@/components/menu/QuantityStepper";
import SupplementSelector from "@/components/menu/SupplementSelector";
import VariantSelector from "@/components/menu/VariantSelector";
import { colors } from "@/constants/theme";
import { PRODUCTS, SUPPLEMENTS } from "@/data/menu";
import { formatPriceEUR } from "@/lib/format";
import { useCartStore } from "@/store/cart.store";

const ROUTE_BACK_DELAY_MS = 900;

function resolveVariantLabel(categoryId: string): string {
  if (categoryId === "smash-burgers") return "Nombre de steaks";
  if (categoryId === "bowls" || categoryId === "box") return "Taille";
  if (categoryId === "bucket") return "Format";
  return "Options";
}

export default function ProductDetailScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useMemo(() => PRODUCTS.find((p) => p.id === id), [id]);
  const addItem = useCartStore((s) => s.addItem);

  const [variantId, setVariantId] = useState<string | undefined>(
    product?.variants?.[0]?.id,
  );
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  if (!product) {
    return (
      <View className="flex-1 bg-surface items-center justify-center" style={{ paddingHorizontal: 32 }}>
        <Text
          className="text-on-surface"
          style={{
            fontFamily: "BebasNeue_400Regular",
            fontSize: 28,
            letterSpacing: -1,
          }}
        >
          Produit introuvable
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 24 }}>
          <Text className="font-sans-semibold text-primary" style={{ fontSize: 14 }}>
            Retour au menu
          </Text>
        </Pressable>
      </View>
    );
  }

  const applicableSupplements = useMemo(
    () => SUPPLEMENTS.filter((s) => product.availableSupplements.includes(s.id)),
    [product],
  );

  const selectedVariant = product.variants?.find((v) => v.id === variantId);
  const basePrice = selectedVariant?.priceEUR ?? product.priceEUR;
  const supplementsTotal = selectedSupplements.reduce((acc, sid) => {
    const s = SUPPLEMENTS.find((x) => x.id === sid);
    return acc + (s?.priceEUR ?? 0);
  }, 0);
  const lineTotal = (basePrice + supplementsTotal) * quantity;

  const handleToggleSupplement = (sid: string): void => {
    setSelectedSupplements((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid],
    );
  };

  const handleAddToCart = (): void => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem({
      productId: product.id,
      variantId,
      quantity,
      supplements: selectedSupplements,
      notes: notes.trim().length > 0 ? notes.trim() : undefined,
    });
    setToastVisible(true);
    setTimeout(() => {
      router.back();
    }, ROUTE_BACK_DELAY_MS);
  };

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* HERO — flat red backdrop with floating image */}
        <View
          className="bg-primary-container"
          style={{ paddingTop: insets.top + 12, paddingBottom: 48 }}
        >
          <View
            className="flex-row items-center justify-between"
            style={{ paddingHorizontal: 24, marginBottom: 16 }}
          >
            <IconButton
              icon={ArrowLeft}
              variant="light"
              onPress={() => router.back()}
              accessibilityLabel="Retour"
            />
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: "rgba(253,249,238,0.35)",
              }}
            />
            <IconButton
              icon={X}
              variant="light"
              onPress={() => router.back()}
              accessibilityLabel="Fermer"
            />
          </View>

          <View
            className="items-center"
            style={{ paddingHorizontal: 24, marginTop: 16, height: 240 }}
          >
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: "85%", height: "100%" }}
              contentFit="contain"
              transition={300}
              accessibilityIgnoresInvertColors
            />
          </View>
        </View>

        {/* CONTENT SHEET — bleeds over hero by 32px */}
        <View
          className="bg-surface"
          style={{
            marginTop: -32,
            borderTopLeftRadius: 48,
            borderTopRightRadius: 48,
            paddingTop: 32,
          }}
        >
          <View style={{ paddingHorizontal: 24 }}>
            {product.tags.length > 0 ? (
              <View
                className="flex-row"
                style={{ gap: 8, marginBottom: 12 }}
              >
                {product.tags.slice(0, 2).map((t) => (
                  <View
                    key={t}
                    className="bg-primary rounded-full"
                    style={{ paddingHorizontal: 10, paddingVertical: 4 }}
                  >
                    <Text
                      className="font-sans-bold uppercase"
                      style={{
                        fontSize: 9,
                        letterSpacing: 2,
                        color: colors.surface,
                      }}
                    >
                      {t}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            <Text
              className="text-on-surface"
              style={{
                fontFamily: "BebasNeue_400Regular",
                fontSize: 38,
                lineHeight: 42,
                letterSpacing: -1.5,
              }}
            >
              {product.name}
            </Text>

            <Text
              className="font-sans text-on-surface-variant"
              style={{
                fontSize: 14,
                lineHeight: 22,
                marginTop: 12,
              }}
            >
              {product.description}
            </Text>

            <View
              className="flex-row items-baseline"
              style={{ marginTop: 16 }}
            >
              <Text
                className="text-primary"
                style={{
                  fontFamily: "BebasNeue_400Regular",
                  fontSize: 40,
                  letterSpacing: -1,
                }}
              >
                {formatPriceEUR(basePrice)}
              </Text>
              {product.variants !== undefined && product.variants.length > 0 ? (
                <Text
                  className="font-sans text-on-surface-variant"
                  style={{ fontSize: 12, marginLeft: 8 }}
                >
                  · pour la taille sélectionnée
                </Text>
              ) : null}
            </View>
          </View>

          {product.variants !== undefined && product.variants.length > 0 ? (
            <VariantSelector
              variants={product.variants}
              selectedId={variantId}
              onSelect={setVariantId}
              label={resolveVariantLabel(product.categoryId)}
            />
          ) : null}

          {applicableSupplements.length > 0 ? (
            <SupplementSelector
              supplements={applicableSupplements}
              selectedIds={selectedSupplements}
              onToggle={handleToggleSupplement}
            />
          ) : null}

          <QuantityStepper value={quantity} onChange={setQuantity} />
          <NotesField value={notes} onChange={setNotes} />
        </View>
      </ScrollView>

      {/* STICKY CTA BAR */}
      <View
        className="bg-surface"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ajouter ${product.name} au panier pour ${formatPriceEUR(lineTotal)}`}
          onPress={handleAddToCart}
          className="bg-primary rounded-full flex-row items-center justify-between"
          style={{
            paddingHorizontal: 24,
            paddingVertical: 18,
            shadowColor: colors.ink,
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <Text
            className="uppercase"
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 13,
              letterSpacing: 2,
              color: colors.surface,
            }}
          >
            Ajouter au panier
          </Text>
          <View
            className="bg-surface rounded-full"
            style={{ paddingHorizontal: 14, paddingVertical: 6 }}
          >
            <Text
              className="text-primary"
              style={{
                fontFamily: "BebasNeue_400Regular",
                fontSize: 18,
              }}
            >
              {formatPriceEUR(lineTotal)}
            </Text>
          </View>
        </Pressable>
      </View>

      <Toast
        visible={toastVisible}
        message="Ajouté au panier"
        onHide={() => setToastVisible(false)}
        duration={ROUTE_BACK_DELAY_MS}
      />
    </View>
  );
}
