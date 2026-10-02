"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Locale, translations } from "../i18n/translations";
import { config } from "../config";
import { useAuth } from "../hooks/useAuth";
import { getCookie, setCookie } from "../utils/cookies";

type TranslationsType = typeof translations.id;

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationsType;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const { isAuthenticated } = useAuth();
  
  // Timeout ref for debouncing API calls
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize locale
  useEffect(() => {
    // 1. Try to get from cookie first (persisted manual choice)
    const savedLocale = getCookie("app_locale") as Locale;
    
    if (savedLocale && (savedLocale === "id" || savedLocale === "en")) {
      setLocaleState(savedLocale);
      return;
    }
    
    // 2. If no saved preference, determine from timezone
    try {
      const offset = -(new Date().getTimezoneOffset() / 60);
      // UTC+7, UTC+8, UTC+9 are Indonesia timezones
      if (offset === 7 || offset === 8 || offset === 9) {
        setLocaleState("id");
      } else {
        setLocaleState("en");
      }
    } catch (e) {
      setLocaleState("en");
    }
  }, []);

  const syncLocaleToServer = useCallback(async (newLocale: Locale) => {
    if (!isAuthenticated) return;
    
    try {
      const token = getCookie("auth_token");
      if (!token) return;
      
      // Update logic against backend - this endpoint might need to be implemented on backend
      // But we send it anyway based on PRD requirements
      await fetch(`${config.apiUrl}/users/preferences/locale`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ locale: newLocale }),
      }).catch(() => {
        // We only catch network errors here, silent fail in console 
        console.warn("Failed to sync locale to server");
      });
    } catch (err) {
      console.warn("Error syncing locale", err);
    }
  }, [isAuthenticated]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return;
    
    // 1. Update state immediately for instant UI change without refresh
    setLocaleState(newLocale);
    
    // 2. Save to cookie for cross-device/refresh persistence
    setCookie("app_locale", newLocale);
    
    // 3. Debounce API call to server (PRD Requirement: US-005)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      syncLocaleToServer(newLocale);
    }, 1000); // 1s debounce
    
  }, [locale, syncLocaleToServer]);

  const value = {
    locale,
    setLocale,
    t: translations[locale]
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
