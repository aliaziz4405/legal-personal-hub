import React, { useState, useEffect } from 'react';
import { X, Save, Folder } from 'lucide-react';
import {
  AnyLegalResource,
  AppLanguage,
  CategoryDefinition,
  ProjectStatus,
  ReadingStatus,
  ResourceCategory,
} from '../types';
import { translations, getCategoryName } from '../i18n/translations';

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (res: Partial<AnyLegalResource>) => void;
  initialResource?: AnyLegalResource | null;
  categories: CategoryDefinition[];
  defaultCategory?: ResourceCategory;
  language?: AppLanguage;
}

export const ResourceFormModal: React.FC<ResourceFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialResource,
  categories,
  defaultCategory = 'laws',
  language = 'fa',
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [tagInput, setTagInput] = useState('');
  const t = translations[language];

  useEffect(() => {
    if (initialResource) {
      setFormData({ ...initialResource });
      setTagInput(initialResource.tags ? initialResource.tags.join(', ') : '');
    } else {
      const selectedCat = defaultCategory === 'dashboard' || defaultCategory === 'sitemap' || defaultCategory === 'settings' || defaultCategory === 'bookmarks' ? 'laws' : defaultCategory;
      setFormData({
        category: selectedCat,
        title: '',
        description: '',
        notes: '',
        tags: [],
        favorite: false,
        readingStatus: 'Reading',
        status: 'Researching',
      });
      setTagInput('');
    }
  }, [initialResource, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) {
      alert('Please enter a record title.');
      return;
    }

    const tagsArray = tagInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    onSave({
      ...formData,
      tags: tagsArray,
    } as Partial<AnyLegalResource>);
    onClose();
  };

  const currentCat = formData.category || 'laws';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {initialResource 
              ? (language === 'fa' ? 'ویرایش منبع حقوقی' : 'Edit Legal Record') 
              : (language === 'fa' ? 'افزودن منبع حقوقی جدید' : 'Create New Legal Resource')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="resource-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs text-slate-200">
          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
              {language === 'fa' ? 'دسته‌بندی منبع *' : 'Resource Category *'}
            </label>
            <select
              value={currentCat}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              {categories
                .filter((c) => !c.isSystem)
                .map((c) => (
                  <option key={c.id} value={c.slug}>
                    {getCategoryName(c.slug, language, c.name)}
                  </option>
                ))}
            </select>
          </div>

          {/* Primary Title */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
              {t.titleLabel} *
            </label>
            <input
              type="text"
              required
              dir="auto"
              placeholder={language === 'fa' ? 'مثال: قانون مجازات اسلامی، رای شماره ۱۲۳' : "e.g. Criminal Procedure Act 2025, State v Henderson"}
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Specific Field Inputs */}

          {/* LAWS FIELDS */}
          {currentCat === 'laws' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'عنوان کوتاه' : 'Short Title'}</label>
                <input
                  type="text"
                  dir="auto"
                  placeholder={language === 'fa' ? 'عنوان اختصاری' : 'e.g. Criminal Procedure Act'}
                  value={formData.shortTitle || ''}
                  onChange={(e) => handleChange('shortTitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{t.jurisdictionLabel}</label>
                <input
                  type="text"
                  dir="auto"
                  placeholder={language === 'fa' ? 'ایران، بین‌الملل' : 'e.g. United Kingdom, European Union'}
                  value={formData.jurisdiction || ''}
                  onChange={(e) => handleChange('jurisdiction', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'مرجع تصویب' : 'Issuing Authority'}</label>
                <input
                  type="text"
                  dir="auto"
                  placeholder={language === 'fa' ? 'مجلس شورای اسلامی' : 'e.g. Parliament'}
                  value={formData.issuingAuthority || ''}
                  onChange={(e) => handleChange('issuingAuthority', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'شماره قانون / استناد' : 'Law Number / Citation'}</label>
                <input
                  type="text"
                  dir="auto"
                  placeholder={language === 'fa' ? 'شماره مصوبه یا ماده' : 'e.g. Act No. 42/2025'}
                  value={formData.citation || ''}
                  onChange={(e) => handleChange('citation', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* CASES FIELDS */}
          {currentCat === 'cases' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'شماره پرونده / دادنامه' : 'Case Number'}</label>
                <input
                  type="text"
                  dir="auto"
                  placeholder={language === 'fa' ? 'مثال: ۹۹۰۹۹۷۰۲۲...' : 'e.g. UKSC 2024/0082'}
                  value={formData.caseNumber || ''}
                  onChange={(e) => handleChange('caseNumber', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'دادگاه / مرجع قضایی' : 'Court'}</label>
                <input
                  type="text"
                  dir="auto"
                  placeholder={language === 'fa' ? 'دیوان عالی کشور، شعبه اول' : 'e.g. Supreme Court of UK'}
                  value={formData.court || ''}
                  onChange={(e) => handleChange('court', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'قاضی / قضات' : 'Judges'}</label>
                <input
                  type="text"
                  dir="auto"
                  placeholder={language === 'fa' ? 'اسامی قضات صادرکننده' : 'e.g. Lord Reed, Lady Hale'}
                  value={formData.judges || ''}
                  onChange={(e) => handleChange('judges', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'مسئله اصلی حقوقی' : 'Legal Issue'}</label>
                <input
                  type="text"
                  dir="auto"
                  placeholder={language === 'fa' ? 'موضوع حقوقی رای' : 'e.g. Corporate mens rea standards'}
                  value={formData.legalIssue || ''}
                  onChange={(e) => handleChange('legalIssue', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* BOOKS FIELDS */}
          {currentCat === 'books' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'نویسنده / مؤلف' : 'Author(s)'}</label>
                <input
                  type="text"
                  dir="auto"
                  placeholder={language === 'fa' ? 'نام نویسنده' : 'e.g. Prof. Arthur Pendelton'}
                  value={formData.author || ''}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'ناشر و سال' : 'Publisher & Year'}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="auto"
                    placeholder={language === 'fa' ? 'انتشارات' : 'Oxford Press'}
                    value={formData.publisher || ''}
                    onChange={(e) => handleChange('publisher', e.target.value)}
                    className="w-2/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="1403"
                    value={formData.publicationYear || ''}
                    onChange={(e) => handleChange('publicationYear', e.target.value)}
                    className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'وضعیت مطالعه' : 'Reading Status'}</label>
                <select
                  value={formData.readingStatus || 'Reading'}
                  onChange={(e) => handleChange('readingStatus', e.target.value as ReadingStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                >
                  <option value="Not started">{language === 'fa' ? 'شروع نشده' : 'Not started'}</option>
                  <option value="Reading">{language === 'fa' ? 'در حال مطالعه' : 'Reading'}</option>
                  <option value="Finished">{language === 'fa' ? 'تمام شده' : 'Finished'}</option>
                  <option value="To read">{language === 'fa' ? 'در صف مطالعه' : 'To read'}</option>
                  <option value="Reference only">{language === 'fa' ? 'فقط مرجع' : 'Reference only'}</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">ISBN</label>
                <input
                  type="text"
                  placeholder="978-0-19-887123-4"
                  value={formData.isbn || ''}
                  onChange={(e) => handleChange('isbn', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono"
                />
              </div>
            </div>
          )}

          {/* ARTICLES FIELDS */}
          {currentCat === 'articles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'نویسندگان' : 'Authors'}</label>
                <input
                  type="text"
                  dir="auto"
                  placeholder={language === 'fa' ? 'نام نویسندگان مقاله' : 'e.g. Prof. Sarah Jenkins'}
                  value={formData.authors || ''}
                  onChange={(e) => handleChange('authors', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'مجله و سال' : 'Journal & Year'}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="auto"
                    placeholder={language === 'fa' ? 'مجله حقوقی' : 'Harvard Law Review'}
                    value={formData.journal || ''}
                    onChange={(e) => handleChange('journal', e.target.value)}
                    className="w-2/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="2025"
                    value={formData.publicationYear || ''}
                    onChange={(e) => handleChange('publicationYear', e.target.value)}
                    className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS FIELDS */}
          {currentCat === 'projects' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'وضعیت پروژه' : 'Project Status'}</label>
                <select
                  value={formData.status || 'Researching'}
                  onChange={(e) => handleChange('status', e.target.value as ProjectStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                >
                  <option value="Idea">{language === 'fa' ? 'ایده اول' : 'Idea'}</option>
                  <option value="Planning">{language === 'fa' ? 'برنامه‌ریزی' : 'Planning'}</option>
                  <option value="Researching">{language === 'fa' ? 'پژوهش فعال' : 'Researching'}</option>
                  <option value="Drafting">{language === 'fa' ? 'نگارش مسوده' : 'Drafting'}</option>
                  <option value="Reviewing">{language === 'fa' ? 'بازبینی' : 'Reviewing'}</option>
                  <option value="Completed">{language === 'fa' ? 'تکمیل شده' : 'Completed'}</option>
                  <option value="Archived">{language === 'fa' ? 'بایگانی' : 'Archived'}</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">{language === 'fa' ? 'مهلت پایان' : 'Deadline'}</label>
                <input
                  type="date"
                  value={formData.deadline || ''}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* NOTES CONTENT */}
          {currentCat === 'notes' && (
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
                {language === 'fa' ? 'متن اصلی یادداشت' : 'Markdown / Note Body'}
              </label>
              <textarea
                rows={6}
                dir="auto"
                placeholder={language === 'fa' ? 'متن یادداشت حقوقی خود را اینجا بنویسید...' : 'Type note content here...'}
                value={formData.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 font-mono text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Description / Summary */}
          {currentCat !== 'notes' && (
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
                {language === 'fa' ? 'توضیحات و خلاصه' : 'Description / Abstract / Summary'}
              </label>
              <textarea
                rows={3}
                dir="auto"
                placeholder={language === 'fa' ? 'خلاصه کوتاهی از این منبع...' : 'Brief summary of this resource...'}
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Research Notes */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
              {language === 'fa' ? 'یادداشت‌های تحلیل شخص' : 'Personal Research Notes'}
            </label>
            <textarea
              rows={2}
              dir="auto"
              placeholder={language === 'fa' ? 'استنادهای کلیدی، تحلیلهای شخص یا نکات مهم...' : 'Key insights, citations to note, or comments...'}
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Local File Path */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
              {language === 'fa' ? 'مسیر فایل محلی PDF' : 'Local PDF / File Path'}
            </label>
            <div className="relative">
              <Folder className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                dir="ltr"
                placeholder="e.g. C:/LegalDocs/Cases/Henderson_2024.pdf or /home/user/Books/AI_Act.pdf"
                value={formData.localFilePath || ''}
                onChange={(e) => handleChange('localFilePath', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none font-mono text-left"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              {language === 'fa' 
                ? '★ مسیر محلی ذخیره می‌شود. با کلیک روی بازکردن، فایل در سیستم شما فراخوانی می‌شود.'
                : '★ Path stored locally. Clicking "Open File" launches your local system reader.'}
            </p>
          </div>

          {/* Source URL & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
                {language === 'fa' ? 'نشانی اینترنتی (URL)' : 'Source URL'}
              </label>
              <input
                type="url"
                dir="ltr"
                placeholder="https://..."
                value={formData.sourceUrl || ''}
                onChange={(e) => handleChange('sourceUrl', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-left"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
                {t.tagsLabel}
              </label>
              <input
                type="text"
                dir="auto"
                placeholder={language === 'fa' ? 'کیفری، ماده-۱۰، دیوان-عالی' : 'criminal, mens-rea, supreme-court'}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Favorite toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="fav-check"
              checked={!!formData.favorite}
              onChange={(e) => handleChange('favorite', e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="fav-check" className="text-xs text-slate-300 cursor-pointer select-none">
              {language === 'fa' ? 'علامت‌گذاری به عنوان نشان‌شده / علاقه‌مندی' : 'Mark as Bookmarked / Favorite'}
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            form="resource-form"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-900/30"
          >
            <Save className="w-4 h-4" />
            <span>{t.save}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
