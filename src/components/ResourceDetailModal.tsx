import React from 'react';
import {
  X,
  Star,
  Edit3,
  Trash2,
  Folder,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { AnyLegalResource, AppLanguage } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { translations, getCategoryName, getStatusTranslation } from '../i18n/translations';

interface ResourceDetailModalProps {
  resource: AnyLegalResource | null;
  language?: AppLanguage;
  onClose: () => void;
  onEdit: (res: AnyLegalResource) => void;
  onDelete: (id: string, title: string) => void;
  onToggleFavorite: (id: string, currentFav: boolean) => void;
  onOpenFile: (path: string) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  language = 'fa',
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenFile,
}) => {
  const [copied, setCopied] = React.useState(false);
  const t = translations[language];

  if (!resource) return null;

  const handleCopyCitation = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Field renderer
  const renderField = (label: string, value?: string | number | null) => {
    if (!value) return null;
    return (
      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
          {label}
        </span>
        <span className="text-xs text-slate-200 font-medium select-text leading-relaxed">
          {String(value)}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl shrink-0 mt-0.5">
              <CategoryIcon name="BookOpen" className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                  {getCategoryName(resource.category, language)}
                </span>
                {resource.createdAt && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-100 select-text leading-snug">
                {resource.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleFavorite(resource.id, resource.favorite)}
              className="p-2 text-slate-400 hover:text-amber-400 rounded-lg transition-colors"
              title={resource.favorite ? 'Unstar' : 'Star'}
            >
              <Star
                className={`w-5 h-5 ${
                  resource.favorite ? 'fill-amber-400 text-amber-400' : ''
                }`}
              />
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(resource);
              }}
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
              title={t.edit}
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(resource.id, resource.title);
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title={t.delete}
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar text-slate-300">
          {/* Main Description or Note Content */}
          {resource.description && (
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                {language === 'fa' ? 'توضیحات و خلاصه' : 'Description / Abstract'}
              </h3>
              <p className="text-xs text-slate-200 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-wrap select-text">
                {resource.description}
              </p>
            </div>
          )}

          {'content' in resource && resource.content && (
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                {language === 'fa' ? 'متن یادداشت' : 'Note Content'}
              </h3>
              <div className="text-xs text-slate-200 bg-slate-950/80 p-4 rounded-xl border border-slate-800 font-mono leading-relaxed whitespace-pre-wrap select-text">
                {resource.content}
              </div>
            </div>
          )}

          {/* Specific Metadata Fields Grid */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              {language === 'fa' ? 'مشخصات و متاداده‌ها' : 'Metadata & Attributes'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {'shortTitle' in resource && renderField(language === 'fa' ? 'عنوان کوتاه' : 'Short Title', resource.shortTitle)}
              {'jurisdiction' in resource && renderField(t.jurisdictionLabel, resource.jurisdiction)}
              {'legalSystem' in resource && renderField(language === 'fa' ? 'نظام حقوقی' : 'Legal System', resource.legalSystem)}
              {'date' in resource && renderField(language === 'fa' ? 'تاریخ تصویب/صدور' : 'Date', resource.date)}
              {'issuingAuthority' in resource && renderField(language === 'fa' ? 'مرجع تصویب' : 'Issuing Authority', resource.issuingAuthority)}
              {'lawNumber' in resource && renderField(language === 'fa' ? 'شماره قانون/مصوبه' : 'Law / Act Number', resource.lawNumber)}
              {'citation' in resource && renderField(language === 'fa' ? 'استناد' : 'Citation', resource.citation)}

              {'caseNumber' in resource && renderField(language === 'fa' ? 'شماره پرونده / دادنامه' : 'Case Number', resource.caseNumber)}
              {'court' in resource && renderField(language === 'fa' ? 'دادگاه / مرجع قضایی' : 'Court', resource.court)}
              {'judges' in resource && renderField(language === 'fa' ? 'قاضی / قضات' : 'Judge(s)', resource.judges)}
              {'parties' in resource && renderField(language === 'fa' ? 'طرفین دعوا' : 'Parties', resource.parties)}
              {'legalIssue' in resource && renderField(language === 'fa' ? 'مسئله اصلی حقوقی' : 'Legal Issue', resource.legalIssue)}
              {'decision' in resource && renderField(language === 'fa' ? 'مفاد رای' : 'Court Decision', resource.decision)}
              {'legalPrinciple' in resource && renderField(language === 'fa' ? 'اصل / رویه حقوقی' : 'Legal Principle', resource.legalPrinciple)}

              {'author' in resource && renderField(language === 'fa' ? 'نویسنده' : 'Author', resource.author)}
              {'authors' in resource && renderField(language === 'fa' ? 'نویسندگان' : 'Authors', resource.authors)}
              {'publisher' in resource && renderField(language === 'fa' ? 'ناشر' : 'Publisher', resource.publisher)}
              {'publicationYear' in resource && renderField(language === 'fa' ? 'سال انتشار' : 'Year', resource.publicationYear)}
              {'isbn' in resource && renderField('ISBN', resource.isbn)}
              {'rating' in resource && renderField(language === 'fa' ? 'امتیاز' : 'Rating', resource.rating ? `★ ${resource.rating}/5` : null)}
              {'readingStatus' in resource && renderField(language === 'fa' ? 'وضعیت مطالعه' : 'Reading Status', getStatusTranslation(resource.readingStatus, language))}

              {'journal' in resource && renderField(language === 'fa' ? 'مجله / نشریه' : 'Journal', resource.journal)}
              {'volume' in resource && renderField(language === 'fa' ? 'دوره / شماره' : 'Volume / Issue', `${resource.volume || ''} ${resource.issue ? `(${resource.issue})` : ''}`)}
              {'doi' in resource && renderField('DOI', resource.doi)}

              {'universityName' in resource && renderField(language === 'fa' ? 'دانشگاه / دانشکده' : 'University Name', resource.universityName)}
              {'faculty' in resource && renderField(language === 'fa' ? 'دانشکده' : 'Faculty / Department', resource.faculty)}
              {'researchers' in resource && renderField(language === 'fa' ? 'پژوهشگران' : 'Key Researchers', resource.researchers)}

              {'toolName' in resource && renderField(language === 'fa' ? 'نام ابزار' : 'Tool Name', resource.toolName)}
              {'provider' in resource && renderField(language === 'fa' ? 'ارائه‌دهنده' : 'Provider', resource.provider)}

              {'status' in resource && renderField(language === 'fa' ? 'وضعیت پروژه' : 'Project Status', getStatusTranslation(resource.status, language))}
              {'deadline' in resource && renderField(language === 'fa' ? 'مهلت پایان' : 'Project Deadline', resource.deadline)}
            </div>
          </div>

          {/* Research Notes */}
          {resource.notes && (
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                {language === 'fa' ? 'یادداشت‌های تحلیلی شخص' : 'Personal Research Notes'}
              </h3>
              <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-xl text-xs text-amber-200/90 leading-relaxed font-sans whitespace-pre-wrap select-text">
                {resource.notes}
              </div>
            </div>
          )}

          {/* Local File Path & Source URL */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              {language === 'fa' ? 'فایل محلی و پیوندها' : 'Local File & External Links'}
            </h3>

            {resource.localFilePath && (
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 min-w-0">
                  <Folder className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300 truncate select-all">{resource.localFilePath}</span>
                </div>
                <button
                  onClick={() => onOpenFile(resource.localFilePath!)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-sans font-semibold shrink-0 transition-colors"
                >
                  {t.openLocalFile}
                </button>
              </div>
            )}

            {resource.sourceUrl && (
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 min-w-0">
                  <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                  <a
                    href={resource.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline truncate"
                  >
                    {resource.sourceUrl}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t.tagsLabel}
              </h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {'citation' in resource && resource.citation ? (
            <button
              onClick={() => handleCopyCitation(resource.citation as string)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'fa' ? 'کپی شد!' : 'Citation Copied!') : (language === 'fa' ? 'کپی استناد' : 'Copy Citation')}</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-500 font-mono">
              ID: {resource.id}
            </span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

