import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { supabase } from "@/lib/supabase";

import { asyncStorageAdapter } from "./_storage";

const DEV_AUTH = process.env.EXPO_PUBLIC_DEV_AUTH === "true";
const DEV_OTP_CODE = "000000";
const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

type AuthState = {
  onboardingDone: boolean;
  authed: boolean;
  signupDone: boolean;
  phone: string;
  loading: boolean;
  completeOnboarding: () => void;
  sendOtp: (phone: string) => Promise<{ error?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<{ error?: string; isNewUser?: boolean }>;
  completeSignup: () => void;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      onboardingDone: false,
      authed: false,
      signupDone: false,
      phone: "",
      loading: false,

      completeOnboarding: () => {
        set({ onboardingDone: true });
      },

      sendOtp: async (phone: string) => {
        set({ loading: true });
        const normalized = phone.startsWith("+33")
          ? phone
          : `+33${phone.replace(/^0/, "")}`;

        if (DEV_AUTH) {
          set({ loading: false, phone: normalized });
          return {};
        }

        const { error } = await supabase.auth.signInWithOtp({
          phone: normalized,
        });

        set({ loading: false });
        if (error) return { error: error.message };
        return {};
      },

      verifyOtp: async (phone: string, code: string) => {
        set({ loading: true });
        const normalized = phone.startsWith("+33")
          ? phone
          : `+33${phone.replace(/^0/, "")}`;

        if (DEV_AUTH) {
          if (code !== DEV_OTP_CODE) {
            set({ loading: false });
            return { error: `Code invalide (utilise ${DEV_OTP_CODE} en dev)` };
          }
          try {
            const res = await fetch(`${API_BASE}/auth/dev-signin`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone: normalized, code }),
            });
            const json = (await res.json()) as {
              data?: {
                access_token: string;
                refresh_token: string;
                user?: { id?: string };
              };
              error?: { message?: string };
            };
            if (!res.ok || !json.data) {
              set({ loading: false });
              return {
                error: json.error?.message ?? `Dev sign-in failed (${res.status})`,
              };
            }
            const { error: setErr, data: sessionData } =
              await supabase.auth.setSession({
                access_token: json.data.access_token,
                refresh_token: json.data.refresh_token,
              });
            set({ loading: false });
            if (setErr) return { error: setErr.message };

            const isNewUser = !sessionData.user?.user_metadata?.name;
            set({
              authed: true,
              phone: normalized,
              signupDone: !isNewUser,
            });
            return { isNewUser };
          } catch (e) {
            set({ loading: false });
            return {
              error: e instanceof Error ? e.message : "Dev sign-in failed",
            };
          }
        }

        const { data, error } = await supabase.auth.verifyOtp({
          phone: normalized,
          token: code,
          type: "sms",
        });

        set({ loading: false });
        if (error) return { error: error.message };

        // Check if user has a name set (i.e., not a new user)
        const isNewUser = !data.user?.user_metadata?.name;

        set({
          authed: true,
          phone: normalized,
          signupDone: !isNewUser,
        });
        return { isNewUser };
      },

      completeSignup: () => {
        set({ signupDone: true });
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ authed: false, signupDone: false, phone: "" });
      },

      restoreSession: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          set({
            authed: true,
            phone: session.user.phone ?? "",
            signupDone: !!session.user.user_metadata?.name,
          });
        }
      },
    }),
    {
      name: "pops.auth.v2",
      storage: createJSONStorage(() => asyncStorageAdapter),
      partialize: (state) => ({
        onboardingDone: state.onboardingDone,
        authed: state.authed,
        signupDone: state.signupDone,
        phone: state.phone,
      }),
    },
  ),
);
