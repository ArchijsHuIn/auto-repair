"use client";

import React from 'react';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded text-sm border ${
          lang === 'en' ? 'bg-white text-blue-600 border-white' : 'bg-blue-500 text-white border-blue-400'
        }`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('lv')}
        className={`px-2 py-1 rounded text-sm border ${
          lang === 'lv' ? 'bg-white text-blue-600 border-white' : 'bg-blue-500 text-white border-blue-400'
        }`}
        aria-pressed={lang === 'lv'}
      >
        LV
      </button>
    </div>
  );
}
