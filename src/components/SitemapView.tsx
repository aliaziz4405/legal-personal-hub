import React from 'react';
import {
  Network as Sitemap,
  LayoutDashboard,
} from 'lucide-react';
import { AppLanguage, CategoryDefinition, ResourceCategory } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { translations, getCategoryName } from '../i18n/translations';

interface SitemapViewProps {
  categories: CategoryDefinition[];
  language?: AppLanguage;
  onSelectCategory: (cat: ResourceCategory) => void;
  categoryCounts: Record<string, number>;
}

export const SitemapView: React.FC<SitemapViewProps> = ({
  categories,
  language = 'fa',
  onSelectCategory,
  categoryCounts,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
            <Sitemap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{t.sitemapTitle}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'fa' 
                ? 'نقشه جامع ساختار اطلاعاتی سامانه دانش حقوقی. جهت ورود به هر بخش روی نام آن کلیک کنید.'
                : 'Visual map of the Legal Knowledge Hub. Click any section node to jump directly to its workspace.'}
            </p>
          </div>
        </div>
      </div>

      {/* Hierarchical Sitemap Cards Tree */}
      <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-8">
        {/* Root Node */}
        <div className="flex justify-center">
          <div
            onClick={() => onSelectCategory('dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-900/40 cursor-pointer flex items-center gap-2 hover:bg-blue-500 transition-all border border-blue-400/40"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t.appTitle} ({t.dashboard})</span>
          </div>
        </div>

        <div className="w-0.5 h-6 bg-slate-800 mx-auto" />

        {/* Level 1 Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Section 1: Primary Legal Sources */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              {language === 'fa' ? 'منابع اصلی حقوقی' : 'Primary Sources'}
            </h3>
            <div className="space-y-2">
              {['laws', 'cases'].map((slug) => {
                const cat = categories.find((c) => c.slug === slug);
                if (!cat) return null;
                const count = categoryCounts[slug] || 0;
                const name = getCategoryName(cat.slug, language, cat.name);
                return (
                  <div key={cat.id} className="space-y-1">
                    <button
                      onClick={() => onSelectCategory(cat.slug)}
                      className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800/80 rounded-lg text-xs font-semibold flex items-center justify-between group transition-colors text-start"
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon name={cat.icon} className="w-4 h-4 text-amber-400" />
                        <span>{name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded-full">
                        {count}
                      </span>
                    </button>
                    {cat.subcategories && (
                      <div className={`border-slate-800/80 space-y-1 text-[11px] text-slate-500 font-mono ${language === 'fa' ? 'mr-4 border-r pr-2' : 'ml-4 border-l pl-2'}`}>
                        {cat.subcategories.map((sub) => (
                          <div key={sub.id} className="truncate">
                            └ {sub.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Academic Sources */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              {language === 'fa' ? 'منابع علمی و پژوهشی' : 'Academic Sources'}
            </h3>
            <div className="space-y-2">
              {['books', 'articles', 'journals'].map((slug) => {
                const cat = categories.find((c) => c.slug === slug);
                if (!cat) return null;
                const count = categoryCounts[slug] || 0;
                const name = getCategoryName(cat.slug, language, cat.name);
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.slug)}
                    className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800/80 rounded-lg text-xs font-semibold flex items-center justify-between group transition-colors text-start"
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon name={cat.icon} className="w-4 h-4 text-emerald-400" />
                      <span>{name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Research Infrastructure */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              {language === 'fa' ? 'ابزارها و پایگاه‌ها' : 'Research Tools'}
            </h3>
            <div className="space-y-2">
              {['databases', 'universities', 'ai_tools'].map((slug) => {
                const cat = categories.find((c) => c.slug === slug);
                if (!cat) return null;
                const count = categoryCounts[slug] || 0;
                const name = getCategoryName(cat.slug, language, cat.name);
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.slug)}
                    className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800/80 rounded-lg text-xs font-semibold flex items-center justify-between group transition-colors text-start"
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon name={cat.icon} className="w-4 h-4 text-purple-400" />
                      <span>{name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Projects & System */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              {language === 'fa' ? 'پروژه‌ها و مدیریت' : 'Work & Management'}
            </h3>
            <div className="space-y-2">
              {['projects', 'notes', 'bookmarks', 'settings'].map((slug) => {
                const cat = categories.find((c) => c.slug === slug);
                if (!cat) return null;
                const count = categoryCounts[slug] || 0;
                const name = getCategoryName(cat.slug, language, cat.name);
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.slug)}
                    className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800/80 rounded-lg text-xs font-semibold flex items-center justify-between group transition-colors text-start"
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon name={cat.icon} className="w-4 h-4 text-orange-400" />
                      <span>{name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

