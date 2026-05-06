import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { supabase } from "@/lib/supabase";

import { asyncStorageAdapter } from "./_storage";

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
