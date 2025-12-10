"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, dictionaries, Lang, Dictionary } from './dictionaries';

type I18nContextType = {
  lang: Lang;
  dict: Dictionary;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getFromPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export function I18nProvider({ children, initialLang }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang ?? DEFAULT_LANG);

  // Load preferred language from localStorage on mount (overrides cookie/initialLang if present)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lang') as Lang | null;
      if (stored === 'en' || stored === 'lv') {
        setLangState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist language and update <html lang="...">
  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      try {
        // Persist also in cookie so server can render matching lang on SSR
        document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
      } catch {
        // ignore
      }
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const dict = useMemo(() => dictionaries[lang] ?? dictionaries[DEFAULT_LANG], [lang]);

  const t = useCallback(
    (path: string) => {
      const val = getFromPath(dict, path);
      if (typeof val === 'string') return val;
      // Fallback to English if missing
      const fallback = getFromPath(dictionaries[DEFAULT_LANG], path);
      return typeof fallback === 'string' ? fallback : path;
    },
    [dict]
  );

  const value = useMemo(() => ({ lang, dict, setLang, t }), [lang, dict, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
