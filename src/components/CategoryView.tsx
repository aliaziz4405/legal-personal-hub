import React, { useState, useMemo } from 'react';
import {
  Grid,
  List,
  Table as TableIcon,
  Plus,
  Search,
  Star,
  X,
} from 'lucide-react';
import {
  AnyLegalResource,
  AppLanguage,
  CategoryDefinition,
  ResourceCategory,
  ViewMode,
} from '../types';
import { ResourceCard } from './ResourceCard';
import { CategoryIcon } from './CategoryIcon';
import { translations, getCategoryName, getCategoryDesc } from '../i18n/translations';

interface CategoryViewProps {
  categorySlug: ResourceCategory;
  categoryObj?: CategoryDefinition;
  resources: AnyLegalResource[];
  language: AppLanguage;
  onOpenNewResource: (cat?: ResourceCategory) => void;
  onToggleFavorite: (id: string, fav: boolean) => void;
  onOpenDetails: (res: AnyLegalResource) => void;
  onEdit: (res: AnyLegalResource) => void;
  onDelete: (id: string, title: string) => void;
  onOpenFile: (path: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  categorySlug,
  categoryObj,
  resources,
  language,
  onOpenNewResource,
  onToggleFavorite,
  onOpenDetails,
  onEdit,
  onDelete,
  onOpenFile,
}) => {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchInCat, setSearchInCat] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortField, setSortField] = useState<'createdAt' | 'title' | 'publicationYear'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Collect unique tags for filter dropdown
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    resources.forEach((r) => r.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [resources]);

  // Filtered and Sorted Resources
  const filteredResources = useMemo(() => {
    let result = [...resources];

    if (searchInCat.trim()) {
      const q = searchInCat.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q) ||
          (r.notes || '').toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (favoritesOnly) {
      result = result.filter((r) => r.favorite);
    }

    if (selectedTag !== 'all') {
      result = result.filter((r) => r.tags?.includes(selectedTag));
    }

    result.sort((a, b) => {
      let valA: any = a[sortField] || '';
      let valB: any = b[sortField] || '';

      if (sortField === 'title') {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [resources, searchInCat, favoritesOnly, selectedTag, sortField, sortDir]);

  const catName = getCategoryName(categorySlug, language, categoryObj?.name);
  const catDesc = getCategoryDesc(categorySlug, language, categoryObj?.description);
  const catIcon = categoryObj ? categoryObj.icon : 'Folder';

  return (
    <div className="space-y-5">
      {/* Category Title & View Controls Header */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl shrink-0">
            <CategoryIcon name={catIcon} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100 tracking-wide">{catName}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700">
                {resources.length} {t.records}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{catDesc}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* View Mode Toggle Buttons */}
          <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'card' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'compact' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onOpenNewResource(categorySlug)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-blue-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addRecord}</span>
          </button>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search within category */}
        <div className="relative w-full sm:w-64">
          <Search className={`w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 text-slate-500 ${language === 'fa' ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            dir="auto"
            placeholder={`${t.filter} ${catName}...`}
            value={searchInCat}
            onChange={(e) => setSearchInCat(e.target.value)}
            className={`w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 ${
              language === 'fa' ? 'pr-8 pl-3' : 'pl-8 pr-3'
            }`}
          />
          {searchInCat && (
            <button
              onClick={() => setSearchInCat('')}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 ${language === 'fa' ? 'left-2.5' : 'right-2.5'}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none font-mono"
            >
              <option value="all">{t.allTags} ({availableTags.length})</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          )}

          {/* Star Favorites Filter Toggle */}
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors font-medium ${
              favoritesOnly
                ? 'bg-amber-400/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{t.favorites}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none font-mono"
            >
              <option value="createdAt">{t.sort}: {language === 'fa' ? 'تاریخ ثبت' : 'Date Added'}</option>
              <option value="title">{t.sort}: {language === 'fa' ? 'عنوان' : 'Title'}</option>
              <option value="publicationYear">{t.sort}: {language === 'fa' ? 'سال' : 'Year'}</option>
            </select>

            <button
              onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg font-mono text-[11px]"
              title={`Sort Direction: ${sortDir.toUpperCase()}`}
            >
              {sortDir.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* RESOURCE LIST / GRID / TABLE */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
            <CategoryIcon name={catIcon} size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-200">
            {language === 'fa' ? `هیچ سندی در ${catName} یافت نشد` : `No records found in ${catName}`}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchInCat || favoritesOnly || selectedTag !== 'all'
              ? (language === 'fa' ? 'هیچ موردی با فیلترهای اعمال شده مطابقت ندارد.' : 'No items matched your search filters.')
              : (language === 'fa' ? `با ثبت اولین سند، پایگاه دانش ${catName} را تکمیل کنید.` : `Start building your ${catName} repository.`)}
          </p>
          <button
            onClick={() => onOpenNewResource(categorySlug)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ {t.addRecord}</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-3 w-10 text-center">★</th>
                  <th className="p-3">{t.titleLabel}</th>
                  <th className="p-3">{t.categoryLabel}</th>
                  <th className="p-3">{t.jurisdictionLabel}</th>
                  <th className="p-3">{t.tagsLabel}</th>
                  <th className="p-3 text-end">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((res) => (
                  <ResourceCard
                    key={res.id}
                    resource={res}
                    viewMode="table"
                    language={language}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetails={onOpenDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onOpenFile={onOpenFile}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === 'card'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'space-y-2.5'
          }
        >
          {filteredResources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              viewMode={viewMode}
              language={language}
              onToggleFavorite={onToggleFavorite}
              onOpenDetails={onOpenDetails}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpenFile={onOpenFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

