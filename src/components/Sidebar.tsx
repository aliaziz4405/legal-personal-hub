import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Network as Sitemap,
  Settings,
  Star,
  Edit3,
} from 'lucide-react';
import { AppLanguage, CategoryDefinition, ResourceCategory } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { translations, getCategoryName } from '../i18n/translations';

interface SidebarProps {
  categories: CategoryDefinition[];
  currentCategory: ResourceCategory;
  language: AppLanguage;
  onSelectCategory: (cat: ResourceCategory) => void;
  categoryCounts: Record<string, number>;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  currentCategory,
  language,
  onSelectCategory,
  categoryCounts,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const t = translations[language];
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({
    laws: true,
    cases: true,
  });

  const toggleSub = (catSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubs((prev) => ({ ...prev, [catSlug]: !prev[catSlug] }));
  };

  const handleCategoryClick = (slug: ResourceCategory) => {
    onSelectCategory(slug);
    onCloseMobile();
  };

  // Group categories into sections
  const mainCategories = categories.filter(
    (c) => !c.isSystem && c.slug !== 'sitemap' && c.slug !== 'settings'
  );
  const systemCategories = categories.filter((c) => c.isSystem);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 z-50 bg-slate-900 border-x border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out select-none shadow-sm ${
          collapsed ? 'w-16' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Collapse Toggle Header Button */}
        <div className="h-12 border-b border-slate-800/80 px-3 flex items-center justify-between">
          {!collapsed && (
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              {t.appTitle}
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? (
              language === 'fa' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              language === 'fa' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Scrollable Category List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 custom-scrollbar">
          {/* Main Dashboard Section */}
          <div className="space-y-1">
            {systemCategories
              .filter((c) => c.slug === 'dashboard' || c.slug === 'bookmarks')
              .map((cat) => {
                const isActive = currentCategory === cat.slug;
                const count = categoryCounts[cat.slug] || 0;
                const catTranslatedName = getCategoryName(cat.slug, language, cat.name);

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold shadow-xs'
                        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/70'
                    }`}
                    title={collapsed ? catTranslatedName : undefined}
                  >
                    <div
                      className={`p-1 rounded-md transition-colors ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      <CategoryIcon name={cat.icon} size={18} />
                    </div>
                    {!collapsed && (
                      <div className="flex-1 flex items-center justify-between text-start">
                        <span className="truncate">{catTranslatedName}</span>
                        {count > 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                              isActive
                                ? 'bg-blue-500/30 text-blue-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
          </div>

          <div className="border-t border-slate-800/60 pt-3">
            {!collapsed && (
              <div className="px-2 mb-2 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                <span>{t.categoryLabel}</span>
                <button
                  onClick={() => handleCategoryClick('settings')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                  title="Customize Sidebar Categories"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="space-y-1">
              {mainCategories.map((cat) => {
                const isActive = currentCategory === cat.slug;
                const count = categoryCounts[cat.slug] || 0;
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                const isSubExpanded = expandedSubs[cat.slug];
                const catTranslatedName = getCategoryName(cat.slug, language, cat.name);

                return (
                  <div key={cat.id} className="space-y-0.5">
                    <button
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold shadow-xs'
                          : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/70'
                      }`}
                      title={collapsed ? catTranslatedName : undefined}
                    >
                      <div
                        className={`p-1 rounded-md ${
                          isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        <CategoryIcon name={cat.icon} size={18} />
                      </div>
                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between text-start">
                          <span className="truncate">{catTranslatedName}</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                isActive
                                  ? 'bg-blue-500/30 text-blue-300'
                                  : 'bg-slate-800/90 text-slate-400'
                              }`}
                            >
                              {count}
                            </span>
                            {hasSubs && (
                              <div
                                onClick={(e) => toggleSub(cat.slug, e)}
                                className="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-300"
                              >
                                {isSubExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronRight className={`w-3.5 h-3.5 ${language === 'fa' ? 'rotate-180' : ''}`} />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </button>

                    {/* Subcategories */}
                    {!collapsed && hasSubs && isSubExpanded && (
                      <div className={`${language === 'fa' ? 'mr-7 pr-2 border-r' : 'ml-7 pl-2 border-l'} border-slate-800 space-y-0.5 py-1`}>
                        {cat.subcategories?.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleCategoryClick(cat.slug)}
                            className="w-full text-start px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 truncate transition-colors cursor-pointer"
                          >
                            • {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Pages: Sitemap & Settings */}
          <div className="border-t border-slate-800/60 pt-3 space-y-1">
            {!collapsed && (
              <div className="px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                {t.sitemap} & {t.settings}
              </div>
            )}

            <button
              onClick={() => handleCategoryClick('sitemap')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                currentCategory === 'sitemap'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/70'
              }`}
              title={collapsed ? t.sitemap : undefined}
            >
              <div className="p-1 text-slate-400 group-hover:text-slate-200">
                <Sitemap className="w-4 h-4" />
              </div>
              {!collapsed && <span>{t.sitemap}</span>}
            </button>

            <button
              onClick={() => handleCategoryClick('settings')}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                currentCategory === 'settings'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/70'
              }`}
              title={collapsed ? t.settings : undefined}
            >
              <div className="p-1 text-slate-400 group-hover:text-slate-200">
                <Settings className="w-4 h-4" />
              </div>
              {!collapsed && <span>{t.settings}</span>}
            </button>
          </div>
        </div>

        {/* Footer info */}
        {!collapsed && (
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>{language === 'fa' ? 'زبان: فارسی (وزیرمتن)' : 'Lang: English (Times)'}</span>
            <span className="text-emerald-400 font-medium">SQLite</span>
          </div>
        )}
      </aside>
    </>
  );
};
