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
import { ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import IconButton from "@/components/common/IconButton";
import OrderRecap from "@/components/checkout/OrderRecap";
import PickupCard from "@/components/checkout/PickupCard";
import CommitToggle from "@/components/form/CommitToggle";
import TextField from "@/components/form/TextField";
import { colors } from "@/constants/theme";
import { PRODUCTS_BY_ID } from "@/data/menu";
import { formatPriceEUR } from "@/lib/format";
import { useCartStore } from "@/store/cart.store";
import { useOrdersStore } from "@/store/orders.store";
import { useProfileStore } from "@/store/profile.store";

const PHONE_REGEX = /^0[67](\d{2}){4}$/;
const PHONE_DIGITS_REGEX = /\D/g;

function formatFrenchMobile(raw: string): string {
  const digits = raw.replace(PHONE_DIGITS_REGEX, "").slice(0, 10);
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
  const [phone, setPhone] = useState<string>(profile.phone ?? "");
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();

  useEffect(() => {
    if (items.length === 0) {
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

  const hasPhoneContent = phone.replace(/\s/g, "").length > 0;
  const phoneDigits = phone.replace(/\s/g, "");
  const isPhoneInvalid = hasPhoneContent && phoneDigits.length >= 10 && !PHONE_REGEX.test(phoneDigits);
  const canConfirm =
    name.trim().length >= 2 && confirmed && !isPhoneInvalid;

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
      setNameError("Votre prénom est requis.");
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
    router.replace({
      pathname: "/order/[id]",
      params: { id: newOrder.id },
    });
  };

  if (items.length === 0) {
    return <View style={{ flex: 1, backgroundColor: colors.surface }} />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 160,
        }}
      >
        {/* Top bar */}
        <View
          className="flex-row items-center justify-between"
          style={{ paddingHorizontal: 24, marginBottom: 8 }}
        >
          <IconButton
            icon={ArrowLeft}
            variant="light"
            onPress={() => router.back()}
            accessibilityLabel="Retour au panier"
          />
          <Text
            className="font-sans-semibold text-on-surface-variant uppercase"
            style={{ fontSize: 11, letterSpacing: 3 }}
          >
            Confirmation
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Editorial header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
          <Text
            className="font-sans-semibold text-on-surface-variant uppercase"
            style={{ fontSize: 11, letterSpacing: 3 }}
          >
            Dernière étape
          </Text>
          <Text
            className="text-on-surface"
            style={{
              fontFamily: "BebasNeue_400Regular",
              fontSize: 44,
              lineHeight: 48,
              letterSpacing: -1.5,
              marginTop: 4,
            }}
          >
            Qui commande ?
          </Text>
        </View>

        {/* Name field */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
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

        {/* Phone field */}
        <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
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

        {/* Pickup info card */}
        <View style={{ marginTop: 32 }}>
          <PickupCard minutes={estimatedMinutes} />
        </View>

        {/* Commitment toggle */}
        <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
          <CommitToggle value={confirmed} onChange={setConfirmed} />
        </View>

        {/* Order recap */}
        <View style={{ marginTop: 32 }}>
          <OrderRecap items={items} total={total} />
        </View>

        {/* Editorial tombstone */}
        <View
          className="items-center"
          style={{ paddingHorizontal: 24, marginTop: 32 }}
        >
          <View
            style={{
              width: 32,
              height: 2,
              backgroundColor: colors.border,
              marginBottom: 16,
            }}
          />
          <Text
            className="font-sans-semibold text-on-surface-variant uppercase"
            style={{ fontSize: 10, letterSpacing: 3, textAlign: "center" }}
          >
            Paiement sur place · Villepinte
          </Text>
        </View>
      </ScrollView>

      {/* STICKY CTA */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
          backgroundColor: colors.surface,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            canConfirm
              ? `Confirmer la commande pour ${formatPriceEUR(total)}`
              : "Complétez les champs pour confirmer"
          }
          accessibilityState={{ disabled: !canConfirm }}
          onPress={handleConfirm}
          className={`flex-row items-center justify-between rounded-full ${
            canConfirm ? "bg-primary" : "bg-surface-container-high"
          }`}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 18,
            opacity: canConfirm ? 1 : 0.7,
            ...(canConfirm
              ? {
                  shadowColor: colors.ink,
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.08,
                  shadowRadius: 24,
                  elevation: 8,
                }
              : {}),
          }}
        >
          <Text
            className="uppercase"
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 13,
              letterSpacing: 2,
              color: canConfirm ? colors.surface : colors.inkMuted,
            }}
          >
            {canConfirm ? "Je confirme" : "Complétez les champs"}
          </Text>
          <View
            className={`flex-row items-center rounded-full ${
              canConfirm ? "bg-surface" : "bg-surface-container"
            }`}
            style={{ paddingHorizontal: 14, paddingVertical: 6, gap: 4 }}
          >
            <Text
              className={canConfirm ? "text-primary" : "text-on-surface-variant"}
              style={{
                fontFamily: "BebasNeue_400Regular",
                fontSize: 18,
              }}
            >
              {formatPriceEUR(total)}
            </Text>
          </View>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
