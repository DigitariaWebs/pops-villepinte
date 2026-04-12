import { useRef, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { ArrowLeft, Phone } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";
import { useProfileStore } from "@/store/profile.store";

const MOCK_OTP = "1234";
const PHONE_REGEX = /^0[67](\d{2}){4}$/;

function formatFrenchMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

export type AuthFlowProps = {
  onComplete: (phone: string) => void;
};

export default function AuthFlow({
  onComplete,
}: AuthFlowProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const setProfilePhone = useProfileStore((s) => s.setPhone);

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [otpError, setOtpError] = useState<string | undefined>();

  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handlePhoneChange = (v: string): void => {
    const formatted = formatFrenchMobile(v);
    setPhone(formatted);
    setPhoneError(undefined);
  };

  const handleSendCode = (): void => {
    const digits = phone.replace(/\s/g, "");
    if (!PHONE_REGEX.test(digits)) {
      setPhoneError("Numéro invalide. Utilise un 06 ou 07.");
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    void Haptics.selectionAsync();
    setStep("otp");
    setTimeout(() => otpRefs[0].current?.focus(), 300);
  };

  const handleOtpDigit = (digit: string, index: number): void => {
    if (digit.length > 1) return;
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError(undefined);

    if (digit !== "" && index < 3) {
      otpRefs[index + 1].current?.focus();
    }

    if (index === 3 && digit !== "") {
      const code = next.join("");
      if (code === MOCK_OTP) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const digits = phone.replace(/\s/g, "");
        setProfilePhone(digits);
        onComplete(digits);
      } else {
        setOtpError("Code incorrect. Réessaye avec 1234.");
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setOtp(["", "", "", ""]);
        setTimeout(() => otpRefs[0].current?.focus(), 200);
      }
    }
  };

  const handleOtpBackspace = (index: number): void => {
    if (otp[index] === "" && index > 0) {
      otpRefs[index - 1].current?.focus();
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
    }
  };

  if (step === "otp") {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          paddingHorizontal: 32,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <Pressable
          onPress={() => setStep("phone")}
          hitSlop={16}
          style={{ alignSelf: "flex-start", marginBottom: 40 }}
        >
          <ArrowLeft size={28} color={colors.ink} strokeWidth={2.5} />
        </Pressable>

        <Text
          style={{
            fontFamily: "BebasNeue_400Regular",
            fontSize: 48,
            lineHeight: 50,
            letterSpacing: 2,
            color: colors.ink,
          }}
        >
          ENTRE{"\n"}TON CODE
        </Text>

        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            color: "rgba(0,0,0,0.6)",
            marginTop: 12,
          }}
        >
          Code envoyé au {phone}
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginTop: 40,
            justifyContent: "center",
          }}
        >
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={otpRefs[i]}
              value={digit}
              onChangeText={(v) => handleOtpDigit(v, i)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") handleOtpBackspace(i);
              }}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                width: 64,
                height: 72,
                borderRadius: 16,
                backgroundColor: colors.ink,
                textAlign: "center",
                fontFamily: "BebasNeue_400Regular",
                fontSize: 32,
                color: colors.primary,
              }}
            />
          ))}
        </View>

        {otpError !== undefined ? (
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 13,
              color: colors.accent,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            {otpError}
          </Text>
        ) : (
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 12,
              color: "rgba(0,0,0,0.4)",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Code de démo : 1234
          </Text>
        )}
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingTop: insets.top + 60,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.ink,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        <Phone size={36} color={colors.primary} strokeWidth={2.5} />
      </View>

      <Text
        style={{
          fontFamily: "BebasNeue_400Regular",
          fontSize: 48,
          lineHeight: 50,
          letterSpacing: 2,
          color: colors.ink,
        }}
      >
        TON{"\n"}NUMÉRO
      </Text>

      <Text
        style={{
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
          color: "rgba(0,0,0,0.6)",
          marginTop: 12,
          maxWidth: 280,
        }}
      >
        On t&apos;envoie un code pour vérifier. Pas de spam, promis.
      </Text>

      <View
        style={{
          backgroundColor: colors.ink,
          borderRadius: 16,
          paddingHorizontal: 20,
          paddingVertical: 18,
          marginTop: 40,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            color: colors.primary,
          }}
        >
          🇫🇷
        </Text>
        <TextInput
          value={phone}
          onChangeText={handlePhoneChange}
          placeholder="06 12 34 56 78"
          placeholderTextColor="rgba(255,206,0,0.35)"
          keyboardType="phone-pad"
          maxLength={14}
          autoFocus
          style={{
            flex: 1,
            fontFamily: "Poppins_600SemiBold",
            fontSize: 18,
            color: colors.primary,
            paddingVertical: 0,
          }}
        />
      </View>

      {phoneError !== undefined ? (
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 13,
            color: colors.accent,
            marginTop: 12,
          }}
        >
          {phoneError}
        </Text>
      ) : null}

      <Pressable
        onPress={handleSendCode}
        style={{
          backgroundColor: colors.ink,
          borderRadius: 999,
          paddingVertical: 18,
          alignItems: "center",
          marginTop: 32,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 14,
            letterSpacing: 1,
            color: colors.primary,
            textTransform: "uppercase",
          }}
        >
          Envoyer le code
        </Text>
      </Pressable>
    </View>
  );
}
