import React, { useState } from 'react';
import {
  Book,
  Globe,
  Network,
  BookOpen,
  Tag,
  Split,
  CheckSquare,
  HardDrive,
  FolderTree,
  FileSpreadsheet,
  Terminal,
  Layers,
  Sparkles,
  Search,
  Check,
  Code,
  ShieldCheck,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../i18n/translations';

interface GuidelineManualViewProps {
  language?: AppLanguage;
}

export const GuidelineManualView: React.FC<GuidelineManualViewProps> = ({ language = 'fa' }) => {
  const [docLang, setDocLang] = useState<'fa' | 'en'>(language === 'en' ? 'en' : 'fa');
  const isFa = docLang === 'fa';

  const [activeSection, setActiveSection] = useState<string>('intro');

  const sections = [
    { id: 'intro', fa: '۱. معرفی و راه‌اندازی سامانه', en: '1. Introduction & Architecture' },
    { id: 'obsidian', fa: '۲. همگام‌سازی با اوبسیدین (Obsidian)', en: '2. Obsidian Vault Sync' },
    { id: 'zotero', fa: '۳. اتصال Zotero و فایل‌های RIS', en: '3. Zotero & RIS Bibliography' },
    { id: 'coding', fa: '۴. کدگذاری ساختاری و تحلیل متن', en: '4. Text Coding & Discourse Analysis' },
    { id: 'splitter', fa: '۵. تجزیه‌گر خودکار اسناد حقوقی', en: '5. Document Parser & Splitter' },
    { id: 'tasks', fa: '۶. میز مدیریت تکالیف و زیرتکالیف', en: '6. Task Board & Subtasks' },
    { id: 'renaming', fa: '۷. تغییر نام و افزودن کلیه عناصر', en: '7. Customizing & Renaming Elements' },
    { id: 'backup', fa: '۸. پشتیبان‌گیری و انتقال داده‌ها', en: '8. Data Backup & Reset' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Manual Header */}
      <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 rounded-xl">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isFa
                ? 'دفترچه راهنمای جامع استفاده از سامانه مدیریت و پژوهش حقوقی'
                : 'Complete User Guideline Manual — Legal Research & Knowledge Hub'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isFa
                ? 'راهنمای قدم به قدم راه‌اندازی، کار با قابلیت‌های پیشرفته و مدیریت دانش حقوقی به دو زبان فارسی و انگلیسی.'
                : 'Step-by-step documentation for setup, advanced features, and workflow operations in Persian & English.'}
            </p>
          </div>
        </div>

        {/* Manual Language Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setDocLang('fa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isFa ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>فارسی</span>
          </button>
          <button
            type="button"
            onClick={() => setDocLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              !isFa ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>English</span>
          </button>
        </div>
      </div>

      {/* Grid Layout with Section Navigation Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Table of Contents */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 h-fit shadow-xs">
          <h3 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 py-1">
            {isFa ? 'فهرست مطالب راهنما' : 'Table of Contents'}
          </h3>

          <div className="space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left font-medium px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-amber-500/10 dark:bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
                style={{ direction: isFa ? 'rtl' : 'ltr' }}
              >
                <span>{isFa ? sec.fa : sec.en}</span>
                {activeSection === sec.id && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Section Detailed Content */}
        <div className="md:col-span-8 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 text-slate-800 dark:text-slate-200 text-xs leading-relaxed shadow-xs">
          {/* SECTION 1: INTRO */}
          {activeSection === 'intro' && (
            <div className="space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="text-base font-bold text-amber-500 dark:text-amber-400 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Layers className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <span>{isFa ? '۱. معرفی، پیش‌نیازها و نحوه اجرای پروژه در ویندوز و لینوکس' : '1. Introduction, System Requirements & How to Run on Windows/Linux'}</span>
              </h3>

              {isFa ? (
                <>
                  <p>
                    سامانه مدیریت دانش و پژوهش حقوقی (Legal Knowledge & Research Hub) یک ابزار جامع چندزبانه برای حقوق‌دانان، وکلا، قضات و پژوهشگران حقوقی است. این سامانه به صورت محلی و کاملاً آفلاین اجرا می‌شود و داده‌ها را با امنیت کامل ذخیره می‌کند.
                  </p>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 font-sans text-xs">
                    <div className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      <span>پیش‌نیازهای سخت‌افزاری و نرم‌افزاری:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      <li><strong>سیستم‌عامل:</strong> ویندوز ۱۰ یا ۱۱ (Windows 10/11) یا توزیع‌های لینوکس (Ubuntu, Fedora, Debian) یا macOS</li>
                      <li><strong>محیط اجرا (Runtime):</strong> نصب داشتن Node.js نسخه ۱۸ به بالا (<code className="text-pink-600 dark:text-pink-400 font-mono">Node.js LTS</code>)</li>
                      <li><strong>مرورگر وب:</strong> آخرین نسخه هر یک از مرورگرهای Firefox، Google Chrome، Microsoft Edge، Brave یا Safari</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 font-mono text-[11px]">
                    <div className="text-blue-600 dark:text-blue-400 font-bold">مراحل اجرای پروژه از روی سورس‌کد (راهنمای گام‌به‌گام):</div>
                    <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        <strong>باز کردن ترمینال یا Command Prompt:</strong>
                        <p className="mr-4 text-slate-500 text-[10px]">در ویندوز کلیدهای Win+R را زده و cmd را تایپ کنید، یا در لینوکس کلیدهای Ctrl+Alt+T را بفشارید.</p>
                      </li>
                      <li>
                        <strong>ورود به پوشه سورس پروژه:</strong>
                        <p className="mr-4 text-pink-600 dark:text-pink-400">cd /path/to/legal-knowledge-hub</p>
                      </li>
                      <li>
                        <strong>نصب وابستگی‌های پروژه (Dependencies):</strong>
                        <p className="mr-4 text-emerald-600 dark:text-emerald-400">npm install</p>
                      </li>
                      <li>
                        <strong>راه اندازی سرور توسعه (Dev Server):</strong>
                        <p className="mr-4 text-emerald-600 dark:text-emerald-400">npm run dev</p>
                      </li>
                      <li>
                        <strong>باز کردن مرورگر وب (Chrome, Firefox, Edge, etc.):</strong>
                        <p className="mr-4 text-blue-600 dark:text-blue-400">آدرس http://localhost:3000 را در مرورگر وارد نمایید.</p>
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-blue-700 dark:text-blue-300">تعیین مسیر ذخیره‌سازی فایل‌های کتابخانه و اسناد (Books & Categories Storage):</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      برای جلوگیری از افزودن فایل‌های سنگین کتب و اسناد حقوقی به داخل خود سورس‌کد پروژه، می‌توانید در بخش <strong>تنظیمات ➔ مسیر فایل‌ها و دسته‌بندی‌ها (Storage Paths & Categories)</strong> مسیر کامل پوشه‌های محلی هارد خود را (مثلاً <code className="font-mono text-pink-600 dark:text-pink-400">D:\LegalBooks</code> در ویندوز یا <code className="font-mono text-pink-600 dark:text-pink-400">/home/user/documents/laws</code> در لینوکس) تعیین کنید. سامانه فایل‌ها را مستقیماً از آن پوشه‌ها خوانده و ذخیره می‌کند.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    The Legal Knowledge & Research Hub is a professional, desktop-ready application designed for jurists, legal scholars, attorneys, and law students. Built on React 18, Vite, and Express.js, it stores data locally and supports custom host directory mapping for PDF/doc storage.
                  </p>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 font-sans text-xs">
                    <div className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      <span>System Requirements:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      <li><strong>OS:</strong> Windows 10/11, Linux (Ubuntu, Debian, Fedora), or macOS</li>
                      <li><strong>Runtime:</strong> Node.js 18.x or higher (<code className="text-pink-600 dark:text-pink-400 font-mono">Node.js LTS</code>)</li>
                      <li><strong>Web Browser:</strong> Firefox, Google Chrome, Microsoft Edge, Brave, or Safari</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 font-mono text-[11px]">
                    <div className="text-blue-600 dark:text-blue-400 font-bold">Step-by-Step Running Instructions from Source Code:</div>
                    <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        <strong>Open Terminal or Windows Command Prompt (cmd) / PowerShell:</strong>
                        <p className="ml-4 text-slate-500 text-[10px]">On Windows press Win+R, type cmd. On Linux press Ctrl+Alt+T.</p>
                      </li>
                      <li>
                        <strong>Navigate to project directory:</strong>
                        <p className="ml-4 text-pink-600 dark:text-pink-400">cd /path/to/legal-knowledge-hub</p>
                      </li>
                      <li>
                        <strong>Install required packages:</strong>
                        <p className="ml-4 text-emerald-600 dark:text-emerald-400">npm install</p>
                      </li>
                      <li>
                        <strong>Start the dev server:</strong>
                        <p className="ml-4 text-emerald-600 dark:text-emerald-400">npm run dev</p>
                      </li>
                      <li>
                        <strong>Launch in browser (Firefox, Chrome, Edge):</strong>
                        <p className="ml-4 text-blue-600 dark:text-blue-400">Open http://localhost:3000</p>
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-blue-700 dark:text-blue-300">Defining Books & Category Storage Directories:</div>
                    <p className="text-slate-700 dark:text-slate-300">
                      To keep large PDF books or files out of the git codebase, configure external folder paths under <strong>Settings ➔ Storage Paths & Categories</strong> (e.g. <code className="font-mono text-pink-600 dark:text-pink-400">D:\LegalBooks</code> or <code className="font-mono text-pink-600 dark:text-pink-400">/var/data/books</code>). Files will be accessed directly from those directories.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SECTION 2: OBSIDIAN */}
          {activeSection === 'obsidian' && (
            <div className="space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Network className="w-5 h-5 text-amber-400" />
                <span>{isFa ? '۲. همگام‌سازی با مخزن اوبسیدین (Obsidian Vault Sync)' : '2. Obsidian Vault Sync'}</span>
              </h3>

              {isFa ? (
                <>
                  <p>
                    این قابلیّت امکان انتقال دوطرفه فیش‌های حقوقی و یادداشت‌ها بین این سامانه و مخزن اوبسیدین (Obsidian Vault) شما را فراهم می‌سازد.
                  </p>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="font-bold text-purple-400">مراحل تنظیم:</div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                      <li>به تب <strong>تنظیمات ➔ همگام‌سازی اوبسیدین</strong> مراجعه کنید.</li>
                      <li>مسیر مطلق پوشه Vault خود را وارد کنید (مثال: <code className="text-pink-400">C:/Users/Lawyer/Obsidian/LegalVault</code>).</li>
                      <li>نام پوشه مقاصد یادداشت‌ها را مشخص کنید (مانند <code className="text-pink-400">LegalNotes</code>).</li>
                      <li>دکمه <strong>صادرکردن کلیه منابع به فایل‌های Markdown</strong> را بفشارید تا تمام قوانین و یادداشت‌ها با مشخصات Frontmatter به اوبسیدین منتقل شوند.</li>
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Integrate your personal Obsidian Knowledge Graph seamlessly with your legal database using structured YAML Frontmatter and Markdown export.
                  </p>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="font-bold text-purple-400">Setup Instructions:</div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                      <li>Go to <strong>Settings ➔ Obsidian Sync</strong>.</li>
                      <li>Set your absolute local Vault path (e.g., <code className="text-pink-400">/home/user/Obsidian/LegalResearch</code>).</li>
                      <li>Specify target subfolder (e.g. <code className="text-pink-400">LegalNotes</code>).</li>
                      <li>Click <strong>Export All Resources to Markdown Files</strong> to generate ready-to-use .md notes with rich tags and citations.</li>
                    </ol>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SECTION 3: ZOTERO */}
          {activeSection === 'zotero' && (
            <div className="space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>{isFa ? '۳. اتصال به Zotero و واردکردن فایل‌های RIS' : '3. Zotero API & RIS Import'}</span>
              </h3>

              {isFa ? (
                <>
                  <p>
                    پژوهشگران حقوقی می‌توانند تمام منابع کتابشناختی خود (شامل کتب، مقالات ژورنال‌ها و آرای قضایی) را از طریق کلید API نرم‌افزار Zotero یا فایل‌های استاندراد <code className="text-emerald-400">.ris</code> وارد سامانه کنند.
                  </p>
                  <div className="space-y-2">
                    <div className="font-bold text-emerald-400">واردکردن دستی فایل .ris:</div>
                    <p className="text-slate-300">
                      کافی است متن فایل RIS خروجی گرفته‌شده از نرم‌افزارهای EndNote یا Zotero را در کادر مربوطه در بخش <strong>تنظیمات ➔ اتصال Zotero & RIS</strong> قرار داده و روی دکمه پردازش کلیک کنید. سیستم تگ‌های <code className="text-amber-400">TY, AU, TI, PY, JO, ER</code> را استخراج کرده و منبع را در دسته مربوطه ایجاد می‌کند.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Import academic and legal references directly via Zotero Web API integration or by pasting standard <code className="text-emerald-400">.ris</code> bibliography metadata format.
                  </p>
                  <div className="space-y-2">
                    <div className="font-bold text-emerald-400">Pasting RIS Metadata:</div>
                    <p className="text-slate-300">
                      Paste the raw contents of any <code className="text-emerald-400">.ris</code> file into the text box under <strong>Settings ➔ Zotero Integration</strong> and click process. The system automatically populates books, articles, or cases into your repository with complete citation info.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SECTION 4: CODING */}
          {activeSection === 'coding' && (
            <div className="space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Tag className="w-5 h-5 text-amber-400" />
                <span>{isFa ? '۴. کدگذاری ساختاری و تحلیل گفتمان حقوقی (Text Coding)' : '4. Structural Text Coding & Analysis'}</span>
              </h3>

              {isFa ? (
                <>
                  <p>
                    این ماژول برای تحلیل کیفی متن قوانین، لوایح و آرای قضایی استفاده می‌شود. شما می‌توانید برچسب‌های رنگی دلخواه (مانند "ارکان جرم"، "عنصر روانی"، "رویه اصلی") تعریف کرده و با قواعد Regex، کلمات کلیدی را به طور خودکار در متن هایلایت نمایید.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>تعریف کدهای رنگی متناسب با تحلیل گفتمان انتقادی (CDA).</li>
                    <li>تعریف قواعد باقاعده (Regex) جهت شناسایی خودکار شماره مواد قانونی و عبارت‌های تخصصی.</li>
                    <li>پیش‌نمایش زنده هایلایت‌ها در کادر خروجی کدگذاری شده.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    A specialized module for qualitative legal discourse analysis and statutory interpretation.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>Create custom colored coding tags for doctrines, holdings, mens rea, and obiter dictum.</li>
                    <li>Define automated Regular Expression (Regex) rules to auto-highlight statutory citations.</li>
                    <li>Real-time side-by-side live text coding editor and preview.</li>
                  </ul>
                </>
              )}
            </div>
          )}

          {/* SECTION 5: SPLITTER */}
          {activeSection === 'splitter' && (
            <div className="space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Split className="w-5 h-5 text-amber-400" />
                <span>{isFa ? '۵. تجزیه‌گر خودکار اسناد حقوقی (Document Splitter)' : '5. Document Parser & Splitter'}</span>
              </h3>

              {isFa ? (
                <>
                  <p>
                    هنگامی که یک فایل متنی جامع از یک قانون یا آیین‌نامه چندصد ماده‌ای دارید، این ابزار بر اساس الگوی Regex تعیین‌شده، سند متنی را به مواد و بخش‌های مجزا تقسیم کرده و می‌تواند همه آن‌ها را به طور خودکار به عنوان مدخل‌های جداگانه در پایگاه قوانین ثبت کند.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Parse large raw text statutes and legal documents into individual article entries using configurable structural regex splitters and automatically register them into the laws database.
                  </p>
                </>
              )}
            </div>
          )}

          {/* SECTION 6: TASKS */}
          {activeSection === 'tasks' && (
            <div className="space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                <CheckSquare className="w-5 h-5 text-amber-400" />
                <span>{isFa ? '۶. میز مدیریت تکالیف و زیرتکالیف (Task Board)' : '6. Tasks Board & Automatic Progress'}</span>
              </h3>

              {isFa ? (
                <>
                  <p>
                    میز تکالیف به شما اجازه می‌دهد پروژه‌های حقوقی را به تکالیف اصلی و مراحل اجرایی (زیرتکالیف) تقسیم کنید.
                  </p>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="font-bold text-blue-400">ویژگی‌های هوشمند تکالیف:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      <li>چک‌باکس علامت‌گذاری برای هر تکلیف و هر زیرتکلیف.</li>
                      <li><strong>محاسبه خودکار درصد پیشرفت:</strong> درصد پیشرفت هر تکلیف اصلی مستقیماً بر اساس تعداد زیرتکالیف انجام‌شده آن محاسبه می‌شود.</li>
                      <li><strong>نوار پیشرفت کل:</strong> نوار بالای میز تکالیف درصد کل پروژه‌های انجام‌شده در کل سامانه را نمایش می‌دهد.</li>
                      <li><strong>قابلیت تغییر نام:</strong> با کلیک روی متن هر تکلیف یا زیرتکلیف می‌توانید عنوان آن را ویرایش کنید.</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Manage legal projects with actionable subtask checklists and automated real-time progress percentage tracking.
                  </p>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="font-bold text-blue-400">Task Board Capabilities:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      <li>Checkboxes for every main task and subtask.</li>
                      <li><strong>Automated Subtask Percentage Progress:</strong> The parent task completion percentage is calculated automatically based on finished subtasks.</li>
                      <li><strong>Overall Progress Bar:</strong> Tracks global completion percentage across all research tasks.</li>
                      <li><strong>Renaming:</strong> Click on any task or subtask title to inline edit and rename it.</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SECTION 7: RENAMING */}
          {activeSection === 'renaming' && (
            <div className="space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                <FolderTree className="w-5 h-5 text-amber-400" />
                <span>{isFa ? '۷. تغییر نام و افزودن کلیه عناصر سامانه' : '7. Renaming & Customizing All Platform Elements'}</span>
              </h3>

              {isFa ? (
                <>
                  <p>
                    بر اساس نیاز کاربر، کلیه عناوین و دسته‌بندی‌های این سامانه قابل تغییر نام و افزودن هستند:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                    <li><strong>دسته‌بندی‌های نوار کناری (Sidebar):</strong> در بخش <i>تنظیمات ➔ معماری دسته‌بندی‌ها</i> می‌توانید دسته‌بندی‌های جدید ایجاد کنید یا نام دسته‌های موجود را ویرایش نمایید.</li>
                    <li><strong>عناوین ویجت‌های داشبورد:</strong> عنوان و ترتیب نمایش ویجت‌های داشبورد را می‌توان تغییر داد.</li>
                    <li><strong>تکالیف و زیرتکالیف:</strong> عنوان هر تکلیف و زیرتکلیف با کلیک روی آن قابل ویرایش است.</li>
                    <li><strong>منابع و فیش‌های حقوقی:</strong> کلیه منابع (قوانین، آراء، کتب، مقالات) دارای دکمه ویرایش کامل جهت تغییر عنوان، برچسب‌ها و یادداشت‌ها هستند.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    You have total authority to customize, rename, and add new elements across the entire project architecture:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                    <li><strong>Sidebar Categories:</strong> Under <i>Settings ➔ Sidebar Architecture</i>, add custom categories, rename existing categories, and edit descriptions.</li>
                    <li><strong>Dashboard Widgets:</strong> Rename widget titles and customize layout order.</li>
                    <li><strong>Tasks & Subtasks:</strong> Click on any task or subtask text to rename instantly.</li>
                    <li><strong>Legal Items & Resources:</strong> Full edit modal allows modifying titles, tags, citation metadata, and attached file paths.</li>
                  </ul>
                </>
              )}
            </div>
          )}

          {/* SECTION 8: BACKUP */}
          {activeSection === 'backup' && (
            <div className="space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                <HardDrive className="w-5 h-5 text-amber-400" />
                <span>{isFa ? '۸. پشتیبان‌گیری، بازیابی و ریست داده‌ها' : '8. Data Backup, Restore & Reset'}</span>
              </h3>

              {isFa ? (
                <>
                  <p>
                    جهت اطمینان از عدم از دست رفتن اطلاعات پژوهشی، می‌توانید در بخش <strong>تنظیمات ➔ پشتیبان‌گیری داده‌ها</strong> اقدام به دریافت خروجی کاملی از فایل JSON کل پایگاه داده نمایید. همچنین دکمه <strong>بازیابی داده‌های اولیه (Reset to Seed)</strong> امکان بازگشت به داده‌های اولیه نمونه را فراهم می‌سازد.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Keep your research safe by exporting full JSON database dumps under <strong>Settings ➔ Data & Backups</strong>. You can restore previous backups or reset to original seed data anytime.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
