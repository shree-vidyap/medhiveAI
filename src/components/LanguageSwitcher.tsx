import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language || 'en';

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिं' },
    { code: 'kn', label: 'ಕನ್ನ' },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
  };

  return (
    <div className="flex items-center bg-[#131C1E] p-1 rounded-xl border border-slate-800 text-xs font-bold gap-0.5">
      <Globe className="w-3.5 h-3.5 text-teal-400 ml-1.5 mr-0.5 shrink-0" />
      {languages.map((lang) => {
        const isSelected = currentLang.startsWith(lang.code);
        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              isSelected
                ? 'bg-teal-600 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            title={`Switch to ${lang.label}`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
};
