import React, { useState, useEffect } from 'react';
import { Search, X, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { AnyLegalResource, AppLanguage } from '../types';
import { translations, getCategoryName } from '../i18n/translations';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: AnyLegalResource[];
  language?: AppLanguage;
  onSelectResource: (res: AnyLegalResource) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  resources,
  language = 'fa',
  onSelectResource,
}) => {
  const [query, setQuery] = useState('');
  const t = translations[language];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? resources.filter((r) => {
        const q = query.toLowerCase().trim();
        return (
          r.title.toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q) ||
          (r.notes || '').toLowerCase().includes(q) ||
          (r as any).content?.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : resources.slice(0, 6); // Show top items when query empty

  const ArrowIcon = language === 'fa' ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90 sticky top-0">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            dir="auto"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results list */}
        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-2 custom-scrollbar">
          <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase">
            {query.trim() 
              ? `${t.searchPlaceholder} (${results.length})` 
              : (language === 'fa' ? 'سندهای اخیر سامانه' : 'Recent Repository Items')}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              {language === 'fa' ? `هیچ موردی برای "${query}" یافت نشد.` : `No matching records found for "${query}".`}
            </div>
          ) : (
            results.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  onSelectResource(r);
                  onClose();
                }}
                className="p-3 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-blue-500/40 rounded-xl cursor-pointer group transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-blue-400 border border-slate-700">
                      {getCategoryName(r.category, language)}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 truncate">
                      {r.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {r.description || (r as any).content || ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {r.favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  <ArrowIcon className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between px-4">
          <span>{language === 'fa' ? 'جهت بستن جستجو کلید ESC یا Ctrl+K را فشار دهید' : 'Use ⌘K or ESC to toggle search'}</span>
          <span>{t.appTitle}</span>
        </div>
      </div>
    </div>
  );
};

