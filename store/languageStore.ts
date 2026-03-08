import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createZustandStorage } from "@/utils/zustand.utils";

type SupportedLocale = "en" | "tr";

interface LanguageState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

/**
 * Detects the device locale on first launch.
 * Turkish devices → "tr", everything else → "en".
 * Falls back to "en" if the Intl API is unavailable.
 */
function detectDeviceLocale(): SupportedLocale {
  try {
    const tag = Intl.DateTimeFormat().resolvedOptions().locale;
    return tag.startsWith("tr") ? "tr" : "en";
  } catch {
    return "en";
  }
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: detectDeviceLocale(),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(createZustandStorage),
    },
  ),
);
