import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { asyncStorageAdapter } from "./_storage";

type AuthState = {
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  phone: string;
  markOnboardingSeen: () => void;
  login: (phone: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      isAuthenticated: false,
      phone: "",

      markOnboardingSeen: () => {
        set({ hasSeenOnboarding: true });
      },

      login: (phone) => {
        set({ isAuthenticated: true, phone });
      },

      logout: () => {
        set({ isAuthenticated: false, phone: "" });
      },
    }),
    {
      name: "pops.auth.v1",
      storage: createJSONStorage(() => asyncStorageAdapter),
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
        isAuthenticated: state.isAuthenticated,
        phone: state.phone,
      }),
    },
  ),
);
