import React, { useState, useMemo } from 'react';
import { FileText, Upload, Split, Eye, Check, ArrowRight, Download, Plus, Save } from 'lucide-react';
import { AppLanguage, AnyLegalResource } from '../types';
import { translations } from '../i18n/translations';

interface SplitArticle {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  lineCount: number;
}

interface DocumentSplitterModuleProps {
  language?: AppLanguage;
  onImportSplitArticles?: (articles: Partial<AnyLegalResource>[]) => void;
}

export const DocumentSplitterModule: React.FC<DocumentSplitterModuleProps> = ({
  language = 'fa',
  onImportSplitArticles,
}) => {
  const t = translations[language] || translations.fa;
  const isFa = language === 'fa';

  const defaultSampleDoc = isFa
    ? `ماده ۱ - کلیات و تعاریف
در این قانون، مفاهیم و واژگان زیر در معانی مشروحه به کار می‌روند:
الف) قانون: قانون جامع ثبت املاک و اراضی.
ب) مرجع ثبتی: سازمان ثبت اسناد و املاک کشور.

ماده ۲ - الزامی بودن ثبت رسمی اموال غیرمنقول
کلیه عقود و معاملات راجع به عین یا منافع املاک و اراضی باید در دفاتر اسناد رسمی ثبت گردند. معاملات عادی ثبت‌نشده در مراجع قضایی و اداری فاقد اعتبار است.

ماده ۳ - ضمانت اجرای استنکاف از ثبت
هرگاه متصرف ملک از تحویل سند مالکیت خودداری ورزد، مرجع ثبتی با اخطار ۱۰ روزه اقدام به ابطال سند پیشین و صدور سند جدید می‌نماید.`
    : `Article 1 - General Definitions
In this Act, the following terms shall have the meanings hereby assigned to them:
(a) Act: The Comprehensive Real Property Registration Act.
(b) Registry: The National Land Registration Authority.

Article 2 - Mandatory Registration of Real Estate Rights
All contracts and transactions concerning title or beneficial ownership of real estate must be registered in official notary public books. Unregistered informal agreements are void in judicial proceedings.

Article 3 - Sanctions for Non-Compliance
Where a possessor refuses to submit title deeds upon notice, the registry authority shall declare the former title void and issue a replacement certificate within 10 days.`;

  const [documentContent, setDocumentContent] = useState<string>(defaultSampleDoc);
  const [fileName, setFileName] = useState<string>('sample_statute.txt');
  const [splitRegex, setSplitRegex] = useState<string>('(?=^\\s*(?:Article|Section|ماده|فصل)\\s+\\d+)');
  const [titleExtractRegex, setTitleExtractRegex] = useState<string>('^(?:Article|Section|ماده|فصل)\\s+\\d+.*');
  const [isImported, setIsImported] = useState<boolean>(false);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) setDocumentContent(text);
      setIsImported(false);
    };
    reader.readAsText(file);
  };

  // Real-time Split Parsing Logic
  const splitArticles = useMemo<SplitArticle[]>(() => {
    if (!documentContent.trim()) return [];

    try {
      const regex = new RegExp(splitRegex, 'mgi');
      const rawChunks = documentContent.split(regex).filter((c) => c.trim().length > 0);

      return rawChunks.map((chunk, index) => {
        const lines = chunk.trim().split('\n');
        let title = lines[0] || `Section ${index + 1}`;

        // If title match regex exists
        try {
          const tRegex = new RegExp(titleExtractRegex, 'i');
          const match = chunk.match(tRegex);
          if (match && match[0]) {
            title = match[0].trim();
          }
        } catch {}

        const words = chunk.trim().split(/\s+/).length;

        return {
          id: `split-${index + 1}`,
          title,
          content: chunk.trim(),
          wordCount: words,
          lineCount: lines.length,
        };
      });
    } catch (err) {
      return [];
    }
  }, [documentContent, splitRegex, titleExtractRegex]);

  const handleExecuteImport = () => {
    if (splitArticles.length === 0) return;

    const resourcesToAdd: Partial<AnyLegalResource>[] = splitArticles.map((art) => ({
      category: 'laws',
      title: art.title,
      description: art.content.slice(0, 150) + '...',
      content: art.content,
      jurisdiction: isFa ? 'ایران' : 'National',
      sourceUrl: `Parsed from ${fileName}`,
      tags: ['parsed-doc', 'statute-article'],
    }));

    if (onImportSplitArticles) {
      onImportSplitArticles(resourcesToAdd);
    }
    setIsImported(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
            <Split className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {isFa ? 'تجزیه‌گر خودکار اسناد حقوقی (Automated Legal Document Parser)' : 'Automated Legal Document Parser & Splitter'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa
                ? 'تفکیک هوشمند فایل‌های متنی حجیم (قوانین و آیین‌نامه‌ها) به مواد و بخش‌های مجزا بر اساس قواعد Regex.'
                : 'Split large legal text files into individual article Markdown files based on structural delimiters.'}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Drag & Drop */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          {isFa ? '۱. بارگذاری سند جامع حقوقی' : '1. Upload Full Legal Document'}
        </h4>

        <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-950 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group">
          <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors mb-2" />
          <span className="text-xs font-semibold text-slate-200">
            {isFa ? `انتخاب یا کشیدن فایل متنی (${fileName})` : `Click to choose or drag text file (${fileName})`}
          </span>
          <span className="text-[10px] font-mono text-slate-500 mt-1">
            Supports .txt, .md, .law, .raw
          </span>
          <input
            type="file"
            accept=".txt,.md,.law,.raw"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Delimiter & Split-Pattern Config */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          {isFa ? '۲. تنظیمات عبارت باقاعده جداکننده (Regex Delimiter)' : '2. Split Pattern & Delimiter Config'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              {isFa ? 'قاعده تفکیک سند (Regex Split Delimiter):' : 'Regex Split Delimiter Pattern:'}
            </label>
            <input
              type="text"
              dir="ltr"
              value={splitRegex}
              onChange={(e) => {
                setSplitRegex(e.target.value);
                setIsImported(false);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono text-left focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              {isFa ? 'قاعده استخراج عنوان ماده/بخش:' : 'Title Extraction Regex:'}
            </label>
            <input
              type="text"
              dir="ltr"
              value={titleExtractRegex}
              onChange={(e) => {
                setTitleExtractRegex(e.target.value);
                setIsImported(false);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono text-left focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Real-time Split Preview Pane */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>
              {isFa
                ? `۳. پیش‌نمایش مواد تفکیک‌شده (${splitArticles.length} بخش شناسایی شد)`
                : `3. Real-Time Split Preview (${splitArticles.length} Sections Extracted)`}
            </span>
          </h4>

          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={splitArticles.length === 0 || isImported}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>
              {isImported
                ? (isFa ? 'مواد به پایگاه افزوده شدند ✔' : 'Imported to Repository ✔')
                : (isFa ? 'افزودن مواد به پایگاه قوانین' : 'Import Split Articles into Repository')}
            </span>
          </button>
        </div>

        {/* Section Cards */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar p-1">
          {splitArticles.map((art, idx) => (
            <div
              key={art.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  {art.title}
                </span>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span>{art.wordCount} words</span>
                  <span>•</span>
                  <span>{art.lineCount} lines</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed whitespace-pre-wrap dir-auto">
                {art.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
