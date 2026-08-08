import React from 'react';
import {
  Scale,
  Search,
  Plus,
  Settings,
  StickyNote,
  ChevronRight,
  Menu,
  ShieldCheck,
  Languages,
  Sun,
  Moon,
  Book,
} from 'lucide-react';
import { AppLanguage, CategoryDefinition, ResourceCategory } from '../types';
import { translations, getCategoryName } from '../i18n/translations';

interface TopBarProps {
  currentCategory: ResourceCategory;
  categories: CategoryDefinition[];
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onSelectCategory: (cat: ResourceCategory) => void;
  onOpenNewResource: (initialCategory?: ResourceCategory) => void;
  onOpenQuickNote: () => void;
  onOpenGlobalSearch: () => void;
  onToggleSidebarMobile: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentCategory,
  categories,
  language,
  onLanguageChange,
  onSelectCategory,
  onOpenNewResource,
  onOpenQuickNote,
  onOpenGlobalSearch,
  onToggleSidebarMobile,
  searchQuery,
  onSearchChange,
}) => {
  const t = translations[language];
  const currentCatObj = categories.find((c) => c.slug === currentCategory);
  const categoryTitle = currentCatObj
    ? getCategoryName(currentCatObj.slug, language, currentCatObj.name)
    : currentCategory === 'manual'
    ? (language === 'fa' ? 'دفترچه راهنما' : 'User Guide')
    : currentCategory === 'tasks'
    ? (language === 'fa' ? 'میز تکالیف' : 'Tasks Board')
    : t.appTitle;

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800/80 px-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md text-slate-100 shadow-sm transition-colors">
      {/* Left: Mobile Menu Toggle, Brand Logo & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebarMobile}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg md:hidden transition-colors cursor-pointer"
          title="Toggle Mobile Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => onSelectCategory('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-all shadow-sm">
            <Scale className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-sm text-slate-100 tracking-wide group-hover:text-blue-400 transition-colors">
              {t.appTitle}
            </h1>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="hidden lg:flex items-center gap-2 mx-3 px-3 border-x border-slate-800 text-xs text-slate-400">
          <span
            onClick={() => onSelectCategory('dashboard')}
            className="hover:text-slate-200 cursor-pointer transition-colors font-medium"
          >
            {t.dashboard}
          </span>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-600 ${language === 'fa' ? 'rotate-180' : ''}`} />
          <span className="text-slate-200 font-semibold text-xs tracking-wide">
            {categoryTitle}
          </span>
        </div>
      </div>

      {/* Middle: Quick Search Input & Global Search Modal Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 ${language === 'fa' ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            dir="auto"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClick={onOpenGlobalSearch}
            className={`w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/60 rounded-lg py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all ${
              language === 'fa' ? 'pr-9 pl-12' : 'pl-9 pr-12'
            }`}
          />
          <kbd className={`absolute top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono ${
            language === 'fa' ? 'left-2.5' : 'right-2.5'
          }`}>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Manual Link, Language Switcher, Quick Actions & Settings */}
      <div className="flex items-center gap-2">
        {/* USER GUIDE MANUAL LINK */}
        <button
          type="button"
          onClick={() => onSelectCategory('manual')}
          className={`p-2 rounded-lg border transition-all cursor-pointer ${
            currentCategory === 'manual'
              ? 'bg-amber-600/20 border-amber-500 text-amber-400'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title={language === 'fa' ? 'راهنمای جامع استفاده' : 'User Guideline Manual'}
        >
          <Book className="w-4 h-4 text-amber-400" />
        </button>

        {/* LANGUAGE SWITCHER BUTTON */}
        <button
          type="button"
          onClick={() => onLanguageChange(language === 'en' ? 'fa' : 'en')}
          className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          title={language === 'en' ? 'تغییر زبان به فارسی' : 'Switch Language to English'}
        >
          <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-[11px]">
            {language === 'en' ? 'فارسی' : 'EN'}
          </span>
        </button>

        <button
          onClick={onOpenGlobalSearch}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden transition-colors"
          title={t.globalSearch}
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenQuickNote}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer"
          title={t.quickNote}
        >
          <StickyNote className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{t.quickNote}</span>
        </button>

        <button
          onClick={() => onOpenNewResource(currentCategory)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm shadow-blue-900/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addRecord}</span>
        </button>

        <button
          onClick={() => onSelectCategory('settings')}
          className={`p-2 rounded-lg transition-colors border cursor-pointer ${
            currentCategory === 'settings'
              ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
          }`}
          title={t.settings}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};


