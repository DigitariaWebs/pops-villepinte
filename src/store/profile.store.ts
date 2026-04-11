import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Profile } from "@/types";

import { asyncStorageAdapter } from "./_storage";

type ProfileState = {
  profile: Profile;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  incrementOrderCount: () => void;
};

const DEFAULT_PROFILE: Profile = {
  name: "Invité",
  phone: "",
  orderCount: 0,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,

      setName: (name) => {
        set((state) => ({ profile: { ...state.profile, name } }));
      },

      setPhone: (phone) => {
        set((state) => ({ profile: { ...state.profile, phone } }));
      },

      incrementOrderCount: () => {
        set((state) => ({
          profile: { ...state.profile, orderCount: state.profile.orderCount + 1 },
        }));
      },
    }),
    {
      name: "pops.profile.v1",
      storage: createJSONStorage(() => asyncStorageAdapter),
      partialize: (state) => ({ profile: state.profile }),
    },
  ),
);
