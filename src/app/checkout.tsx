import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Check, Clock, MapPin, ShieldCheck } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OrderConfirmation from "@/components/order/OrderConfirmation";
import TextField from "@/components/form/TextField";
import { colors, font, radius } from "@/constants/theme";
import { PRODUCTS_BY_ID, SUPPLEMENTS_BY_ID } from "@/data/menu";
import { formatPriceEUR } from "@/lib/format";
import { getLineUnitPrice, useCartStore } from "@/store/cart.store";
import { useOrdersStore } from "@/store/orders.store";
import { useProfileStore } from "@/store/profile.store";

const PHONE_REGEX = /^0[67](\d{2}){4}$/;

function formatFrenchMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

export default function CheckoutScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.totalEUR());
  const clearCart = useCartStore((s) => s.clearCart);
  const placeOrder = useOrdersStore((s) => s.placeOrder);
  const profile = useProfileStore((s) => s.profile);
  const setProfileName = useProfileStore((s) => s.setName);
  const setProfilePhone = useProfileStore((s) => s.setPhone);
  const incrementOrderCount = useProfileStore((s) => s.incrementOrderCount);

  const [name, setName] = useState<string>(
    profile.name === "Invité" ? "" : profile.name,
  );
  const [phone, setPhone] = useState<string>(
    profile.phone ? formatFrenchMobile(profile.phone) : "",
  );
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 && !showConfirmation) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const estimatedMinutes = useMemo(() => {
    if (items.length === 0) return 0;
    const maxPrep = Math.max(
      ...items.map((i) => {
        const p = PRODUCTS_BY_ID[i.productId];
        return p?.prepTimeMinutes ?? 10;
      }),
    );
    return maxPrep + 2;
  }, [items]);

  const itemCount = useMemo(
    () => items.reduce((a, i) => a + i.quantity, 0),
    [items],
  );

  const hasPhoneContent = phone.replace(/\s/g, "").length > 0;
  const phoneDigits = phone.replace(/\s/g, "");
  const isPhoneInvalid = hasPhoneContent && phoneDigits.length >= 10 && !PHONE_REGEX.test(phoneDigits);
  const canConfirm = name.trim().length >= 2 && confirmed && !isPhoneInvalid;

  const handleNameChange = (v: string): void => {
    setName(v);
    if (v.trim().length >= 2) setNameError(undefined);
  };

  const handlePhoneChange = (v: string): void => {
    const formatted = formatFrenchMobile(v);
    setPhone(formatted);
    const digits = formatted.replace(/\s/g, "");
    if (digits.length === 0 || digits.length < 10) {
      setPhoneError(undefined);
      return;
    }
    if (!PHONE_REGEX.test(digits)) {
      setPhoneError("Numéro invalide. Format attendu : 06 ou 07 …");
    } else {
      setPhoneError(undefined);
    }
  };

  const handleConfirm = (): void => {
    if (name.trim().length < 2) {
      setNameError("Ton prénom est requis.");
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (hasPhoneContent && !PHONE_REGEX.test(phoneDigits)) {
      setPhoneError("Numéro invalide.");
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (!confirmed) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setProfileName(name.trim());
    if (hasPhoneContent) setProfilePhone(phoneDigits);
    incrementOrderCount();
    const newOrder = placeOrder(items, total, name.trim());
    clearCart();
    setPendingOrderId(newOrder.id);
    setShowConfirmation(true);
  };

  const handleConfirmationDone = (): void => {
    setShowConfirmation(false);
    if (pendingOrderId !== null) {
      router.replace({
        pathname: "/order/[id]",
        params: { id: pendingOrderId },
      });
    }
  };

  if (items.length === 0 && !showConfirmation) {
    return <View style={{ flex: 1, backgroundColor: colors.white }} />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.white }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 140,
        }}
      >
        {/* Top bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginBottom: 16,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F5F5F5",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} color={colors.ink} strokeWidth={2.5} />
          </Pressable>
          <Text
            style={{
              fontFamily: font.bodySemi,
              fontSize: 13,
              color: colors.inkMuted,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Confirmation
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Header */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: font.display,
              fontSize: 42,
              lineHeight: 44,
              color: colors.ink,
              letterSpacing: 1,
            }}
          >
            QUI COMMANDE ?
          </Text>
          <Text
            style={{
              fontFamily: font.body,
              fontSize: 14,
              color: colors.inkMuted,
              marginTop: 4,
            }}
          >
            Dernière étape avant de te régaler
          </Text>
        </View>

        {/* Fields */}
        <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
          <TextField
            label="Prénom"
            value={name}
            onChangeText={handleNameChange}
            placeholder="Comment tu t'appelles ?"
            error={nameError}
            autoCapitalize="words"
            autoComplete="given-name"
            maxLength={40}
          />
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <TextField
            label="Téléphone"
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="06 12 34 56 78"
            error={phoneError}
            helper="Optionnel — on t'appelle quand c'est prêt."
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={14}
            autoCapitalize="none"
          />
        </View>

        {/* Separator */}
        <View style={{ height: 8, backgroundColor: "#F5F5F5", marginTop: 24 }} />

        {/* Pickup info */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MapPin size={22} color={colors.ink} strokeWidth={2} />
            </View>
            <View>
              <Text style={{ fontFamily: font.bodyBold, fontSize: 15, color: colors.ink }}>
                POP'S Villepinte
              </Text>
              <Text style={{ fontFamily: font.body, fontSize: 12, color: colors.inkMuted, marginTop: 1 }}>
                Avenue Gabriel Péri, 93420
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#F5F5F5",
                borderRadius: radius.lg,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Clock size={20} color={colors.ink} strokeWidth={2} />
              <Text style={{ fontFamily: font.display, fontSize: 36, color: colors.ink, marginTop: 4 }}>
                {estimatedMinutes}
              </Text>
              <Text style={{ fontFamily: font.bodySemi, fontSize: 11, color: colors.inkMuted, letterSpacing: 1 }}>
                MINUTES
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#F5F5F5",
                borderRadius: radius.lg,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: font.bodySemi, fontSize: 12, color: colors.inkMuted }}>
                Paiement
              </Text>
              <Text style={{ fontFamily: font.bodyBold, fontSize: 16, color: colors.ink, marginTop: 6 }}>
                Sur place
              </Text>
              <Text style={{ fontFamily: font.body, fontSize: 11, color: colors.inkMuted, marginTop: 2 }}>
                Cash ou CB
              </Text>
            </View>
          </View>
        </View>

        {/* Separator */}
        <View style={{ height: 8, backgroundColor: "#F5F5F5" }} />

        {/* Commitment */}
        <Pressable
          onPress={() => {
            void Haptics.selectionAsync();
            setConfirmed(!confirmed);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 18,
            gap: 14,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: confirmed ? colors.primary : "#F5F5F5",
              borderWidth: confirmed ? 0 : 2,
              borderColor: "#E0E0E0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {confirmed ? <Check size={16} color={colors.ink} strokeWidth={3} /> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: font.bodySemi, fontSize: 14, color: colors.ink }}>
              Je viens chercher ma commande
            </Text>
            <Text style={{ fontFamily: font.body, fontSize: 12, color: colors.inkMuted, marginTop: 2 }}>
              Ta parole compte — pas de no-show.
            </Text>
          </View>
          <ShieldCheck size={20} color={confirmed ? colors.primary : colors.inkMuted} strokeWidth={2} />
        </Pressable>

        {/* Separator */}
        <View style={{ height: 8, backgroundColor: "#F5F5F5" }} />

        {/* Order recap */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <Text
            style={{
              fontFamily: font.bodyBold,
              fontSize: 11,
              letterSpacing: 2,
              color: colors.inkMuted,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Récapitulatif · {itemCount} article{itemCount > 1 ? "s" : ""}
          </Text>

          {items.map((item) => {
            const product = PRODUCTS_BY_ID[item.productId];
            if (!product) return null;
            const variant = item.variantId
              ? product.variants?.find((v) => v.id === item.variantId)
              : undefined;
            const unitPrice = getLineUnitPrice(item);
            const lineTotal = unitPrice * item.quantity;
            const supNames = item.supplements
              .map((sid) => SUPPLEMENTS_BY_ID[sid]?.name)
              .filter(Boolean)
              .join(", ");

            return (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F5F5F5",
                }}
              >
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={{ fontFamily: font.bodySemi, fontSize: 14, color: colors.ink }}>
                    {item.quantity}× {product.name}
                    {variant ? ` · ${variant.label}` : ""}
                  </Text>
                  {supNames ? (
                    <Text
                      numberOfLines={1}
                      style={{ fontFamily: font.body, fontSize: 11, color: colors.inkMuted, marginTop: 2 }}
                    >
                      {supNames}
                    </Text>
                  ) : null}
                </View>
                <Text style={{ fontFamily: font.bodyBold, fontSize: 14, color: colors.ink }}>
                  {formatPriceEUR(lineTotal)}
                </Text>
              </View>
            );
          })}

          {/* Total */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: 16,
              paddingTop: 14,
              borderTopWidth: 2,
              borderTopColor: colors.ink,
            }}
          >
            <Text style={{ fontFamily: font.bodyBold, fontSize: 16, color: colors.ink }}>
              Total
            </Text>
            <Text style={{ fontFamily: font.display, fontSize: 32, color: colors.ink }}>
              {formatPriceEUR(total)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* STICKY CTA */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.white,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
        }}
      >
        <Pressable
          onPress={handleConfirm}
          style={{
            backgroundColor: canConfirm ? colors.primary : "#E8E8E8",
            borderRadius: radius.lg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            paddingVertical: 16,
            ...(canConfirm
              ? {
                  shadowColor: colors.ink,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 16,
                  elevation: 8,
                }
              : {}),
          }}
        >
          <Text
            style={{
              fontFamily: font.bodyBold,
              fontSize: 15,
              color: canConfirm ? colors.ink : colors.inkMuted,
              letterSpacing: 0.5,
            }}
          >
            {canConfirm ? "CONFIRMER LA COMMANDE" : "COMPLÉTEZ LES CHAMPS"}
          </Text>
          <View
            style={{
              backgroundColor: canConfirm ? colors.ink : "#D0D0D0",
              borderRadius: radius.sm,
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                fontFamily: font.display,
                fontSize: 20,
                color: canConfirm ? colors.primary : colors.inkMuted,
              }}
            >
              {formatPriceEUR(total)}
            </Text>
          </View>
        </Pressable>
      </View>

      <OrderConfirmation
        visible={showConfirmation}
        onDone={handleConfirmationDone}
      />
    </KeyboardAvoidingView>
  );
}
