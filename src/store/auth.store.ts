import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { asyncStorageAdapter } from "./_storage";

type AuthState = {
  hasSeenOnboarding: boolean;
  markOnboardingSeen: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      markOnboardingSeen: () => {
        set({ hasSeenOnboarding: true });
      },
    }),
    {
      name: "pops.auth.v1",
      storage: createJSONStorage(() => asyncStorageAdapter),
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    },
  ),
);
