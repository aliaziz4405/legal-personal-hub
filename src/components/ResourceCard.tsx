import React from 'react';
import {
  Star,
  Edit2,
  Trash2,
  Folder,
  MapPin,
  Calendar,
  Eye,
} from 'lucide-react';
import { AnyLegalResource, AppLanguage, ViewMode } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { translations, getCategoryName, getStatusTranslation } from '../i18n/translations';

interface ResourceCardProps {
  resource: AnyLegalResource;
  viewMode: ViewMode;
  language?: AppLanguage;
  onToggleFavorite: (id: string, currentFav: boolean) => void;
  onOpenDetails: (res: AnyLegalResource) => void;
  onEdit: (res: AnyLegalResource) => void;
  onDelete: (id: string, title: string) => void;
  onOpenFile: (path: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  viewMode,
  language = 'en',
  onToggleFavorite,
  onOpenDetails,
  onEdit,
  onDelete,
  onOpenFile,
}) => {
  const t = translations[language];

  // Category specific icon & badge colors
  const getCategoryMeta = (cat: string) => {
    const translatedName = getCategoryName(cat, language);
    switch (cat) {
      case 'laws':
        return { icon: 'Scale', label: translatedName, color: 'text-amber-400 bg-amber-400/10 border-amber-500/20' };
      case 'cases':
        return { icon: 'Gavel', label: translatedName, color: 'text-blue-400 bg-blue-400/10 border-blue-500/20' };
      case 'books':
        return { icon: 'BookOpen', label: translatedName, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' };
      case 'articles':
        return { icon: 'FileText', label: translatedName, color: 'text-purple-400 bg-purple-400/10 border-purple-500/20' };
      case 'journals':
        return { icon: 'Newspaper', label: translatedName, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-500/20' };
      case 'databases':
        return { icon: 'Database', label: translatedName, color: 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20' };
      case 'universities':
        return { icon: 'Building2', label: translatedName, color: 'text-rose-400 bg-rose-400/10 border-rose-500/20' };
      case 'ai_tools':
        return { icon: 'Bot', label: translatedName, color: 'text-teal-400 bg-teal-400/10 border-teal-500/20' };
      case 'projects':
        return { icon: 'FolderKanban', label: translatedName, color: 'text-orange-400 bg-orange-400/10 border-orange-500/20' };
      case 'notes':
        return { icon: 'StickyNote', label: translatedName, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20' };
      default:
        return { icon: 'Folder', label: translatedName, color: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  const meta = getCategoryMeta(resource.category);

  // Status pills
  const renderStatusBadge = () => {
    if ('readingStatus' in resource && resource.readingStatus) {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
          {getStatusTranslation(resource.readingStatus, language)}
        </span>
      );
    }
    if ('status' in resource && resource.status) {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-blue-900/40 text-blue-300 border border-blue-700/50">
          {getStatusTranslation(resource.status, language)}
        </span>
      );
    }
    return null;
  };

  // Specific Subtitles
  const renderSubtitle = () => {
    if ('shortTitle' in resource && resource.shortTitle) return resource.shortTitle;
    if ('citation' in resource && resource.citation) return resource.citation;
    if ('author' in resource && resource.author) return `${resource.author}`;
    if ('authors' in resource && resource.authors) return `${resource.authors}`;
    if ('court' in resource && resource.court) return resource.court;
    if ('universityName' in resource && resource.universityName) return resource.universityName;
    if ('toolName' in resource && resource.toolName) return resource.toolName;
    return null;
  };

  // TABLE VIEW ROW
  if (viewMode === 'table') {
    return (
      <tr className="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors group text-xs text-slate-300">
        <td className="p-3 w-10 text-center">
          <button
            onClick={() => onToggleFavorite(resource.id, resource.favorite)}
            className="text-slate-600 hover:text-amber-400 transition-colors"
          >
            <Star
              className={`w-4 h-4 ${
                resource.favorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        </td>
        <td className="p-3 font-medium text-slate-100 max-w-xs">
          <div
            onClick={() => onOpenDetails(resource)}
            className="cursor-pointer hover:text-blue-400 font-semibold truncate transition-colors flex items-center gap-2"
          >
            <CategoryIcon name={meta.icon} className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{resource.title}</span>
          </div>
          {renderSubtitle() && (
            <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
              {renderSubtitle()}
            </div>
          )}
        </td>
        <td className="p-3">
          <span className={`text-[10px] px-2 py-0.5 rounded-md border ${meta.color} font-mono`}>
            {meta.label}
          </span>
        </td>
        <td className="p-3 text-slate-400">
          {'jurisdiction' in resource ? (resource as any).jurisdiction : 'country' in resource ? (resource as any).country : '-'}
        </td>
        <td className="p-3 text-slate-400 max-w-[200px] truncate">
          {resource.tags.slice(0, 3).map((tag) => `#${tag}`).join(' ')}
        </td>
        <td className="p-3 text-end">
          <div className="flex items-center justify-end gap-1.5">
            {resource.localFilePath && (
              <button
                onClick={() => onOpenFile(resource.localFilePath!)}
                className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 rounded transition-colors"
                title={`${t.openLocalFile}: ${resource.localFilePath}`}
              >
                <Folder className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onOpenDetails(resource)}
              className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-blue-400 rounded transition-colors"
              title="Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(resource)}
              className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-amber-400 rounded transition-colors"
              title={t.edit}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(resource.id, resource.title)}
              className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded transition-colors"
              title={t.delete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // COMPACT LIST VIEW
  if (viewMode === 'compact') {
    return (
      <div className="p-3 bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-lg flex items-center justify-between gap-3 group transition-all">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onToggleFavorite(resource.id, resource.favorite)}
            className="text-slate-600 hover:text-amber-400 transition-colors shrink-0"
          >
            <Star
              className={`w-4 h-4 ${
                resource.favorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-1.5 py-0.2 rounded border ${meta.color} font-mono shrink-0`}>
                {meta.label}
              </span>
              <h3
                onClick={() => onOpenDetails(resource)}
                className="text-xs font-semibold text-slate-100 hover:text-blue-400 truncate cursor-pointer transition-colors"
              >
                {resource.title}
              </h3>
            </div>
            {renderSubtitle() && (
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{renderSubtitle()}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {renderStatusBadge()}
          {resource.localFilePath && (
            <button
              onClick={() => onOpenFile(resource.localFilePath!)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700/80 rounded text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              <Folder className="w-3 h-3" />
              <span className="hidden sm:inline">{language === 'fa' ? 'فایل' : 'File'}</span>
            </button>
          )}
          <button
            onClick={() => onOpenDetails(resource)}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded transition-colors"
            title="Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(resource)}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded transition-colors"
            title={t.edit}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(resource.id, resource.title)}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded transition-colors"
            title={t.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // CARD VIEW (DEFAULT)
  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-xl flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-black/40 group">
      {/* Card Header: Icon, Category Badge & Favorite Star */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border ${meta.color}`}>
              <CategoryIcon name={meta.icon} className="w-4 h-4" />
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono ${meta.color}`}>
              {meta.label}
            </span>
          </div>

          <button
            onClick={() => onToggleFavorite(resource.id, resource.favorite)}
            className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
            title={resource.favorite ? 'Remove Favorite' : 'Add to Favorites'}
          >
            <Star
              className={`w-4 h-4 ${
                resource.favorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetails(resource)}
          className="text-sm font-semibold text-slate-100 hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors mb-1"
        >
          {resource.title}
        </h3>

        {/* Subtitle / Citation */}
        {renderSubtitle() && (
          <p className="text-xs text-slate-400 font-mono mb-2 line-clamp-1">{renderSubtitle()}</p>
        )}

        {/* Description / Content snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {resource.description || (resource as any).content || ''}
        </p>

        {/* Status or Extra Meta */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {renderStatusBadge()}
          {'jurisdiction' in resource && resource.jurisdiction && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <MapPin className="w-3 h-3 text-slate-500" /> {resource.jurisdiction}
            </span>
          )}
          {'publicationYear' in resource && resource.publicationYear && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-slate-500" /> {resource.publicationYear}
            </span>
          )}
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {resource.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md border border-slate-800/80 font-mono"
              >
                #{tag}
              </span>
            ))}
            {resource.tags.length > 4 && (
              <span className="text-[10px] text-slate-500 font-mono">
                +{resource.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {resource.localFilePath ? (
          <button
            onClick={() => onOpenFile(resource.localFilePath!)}
            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-slate-700/80 rounded-md text-[11px] font-mono flex items-center gap-1.5 transition-colors"
            title={`${t.openLocalFile}: ${resource.localFilePath}`}
          >
            <Folder className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[110px]">{t.openLocalFile}</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-600 font-mono">-</span>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpenDetails(resource)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors flex items-center gap-1 font-medium"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'fa' ? 'مشاهده' : 'Open'}</span>
          </button>
          <button
            onClick={() => onEdit(resource)}
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
            title={t.edit}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(resource.id, resource.title)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            title={t.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

