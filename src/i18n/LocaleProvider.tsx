"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import ar from "@/i18n/messages/ar";
import en from "@/i18n/messages/en";

export type Locale = "ar" | "en";

type Messages = Record<string, string>;

const LOCALE_KEY = "jara-locale";

const localeToDir: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

const messagesByLocale: Record<Locale, Messages> = { ar, en };

interface LocaleContextValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
  setLocale: (loc: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem(LOCALE_KEY) as Locale | null)) || null;
    if (stored && (stored === "ar" || stored === "en")) {
      setLocaleState(stored);
    } else {
      setLocaleState("ar");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCALE_KEY, locale);
    const dir = localeToDir[locale];
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", dir);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const msgs = messagesByLocale[locale] || {};
    const t = (key: string) => msgs[key] ?? key;
    const dir = localeToDir[locale];
    const setLocale = (loc: Locale) => setLocaleState(loc);
    return { locale, dir, t, setLocale };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
