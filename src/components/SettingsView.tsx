import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Check,
  HardDrive,
  Sliders,
  Palette,
  FolderTree,
  FileSpreadsheet,
  AlertTriangle,
  Network,
  BookOpen,
  Tag,
  Split,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';
import { AppLanguage, AppSettings, CategoryDefinition, AnyLegalResource } from '../types';
import { translations } from '../i18n/translations';
import { ObsidianSyncConfig } from './ObsidianSyncConfig';
import { ZoteroIntegrationConfig } from './ZoteroIntegrationConfig';
import { TextCodingAnalysisModule } from './TextCodingAnalysisModule';
import { DocumentSplitterModule } from './DocumentSplitterModule';

interface SettingsViewProps {
  settings: AppSettings;
  categories: CategoryDefinition[];
  language?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
  onSaveSettings: (newSettings: AppSettings) => void;
  onSaveCategories: (newCats: CategoryDefinition[]) => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onResetSeedData: () => void;
  onImportSplitArticles?: (articles: Partial<AnyLegalResource>[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  categories,
  language = 'fa',
  onLanguageChange,
  onSaveSettings,
  onSaveCategories,
  onExportJSON,
  onImportJSON,
  onResetSeedData,
  onImportSplitArticles,
}) => {
  const [activeTab, setActiveTab] = useState<
    'data' | 'architecture' | 'appearance' | 'obsidian' | 'zotero' | 'coding' | 'parser'
  >('data');
  const [localSettings, setLocalSettings] = useState<AppSettings>({ ...settings });
  const [catList, setCatList] = useState<CategoryDefinition[]>([...categories]);
  const [editingCat, setEditingCat] = useState<CategoryDefinition | null>(null);

  const isFa = language === 'fa';

  // New Category Modal Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Folder');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleSettingsChange = (field: keyof AppSettings, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    onSaveSettings(updated);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newCat: CategoryDefinition = {
      id: `cat-custom-${Date.now()}`,
      name: newCatName.trim(),
      slug: slug,
      icon: newCatIcon,
      description: newCatDesc.trim() || 'Custom user category',
      order: catList.length,
      isSystem: false,
    };

    const updated = [...catList, newCat];
    setCatList(updated);
    onSaveCategories(updated);

    setNewCatName('');
    setNewCatDesc('');
    alert(`Added new category "${newCat.name}" to sidebar architecture!`);
  };

  const handleDeleteCategory = (catId: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}" from sidebar architecture?`)) {
      const updated = catList.filter((c) => c.id !== catId);
      setCatList(updated);
      onSaveCategories(updated);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onImportJSON(files[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 rounded-xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isFa ? 'تنظیمات و پیکربندی سامانه' : 'Application Settings & Configuration'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isFa
                ? 'مدیریت پایگاه داده، مسیرهای ذخیره‌سازی محلی کتب/اسناد، همگام‌سازی اوبسیدین، Zotero و تحلیل متن.'
                : 'Manage local database, external file storage paths (books, laws, etc.), Obsidian vault, and Zotero.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('data')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
            activeTab === 'data'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900/60'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>{isFa ? 'پشتیبان‌گیری داده‌ها' : 'Data & Backups'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900/60'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>{isFa ? 'مسیر فایل‌ها و دسته‌بندی‌ها' : 'Storage Paths & Categories'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('obsidian')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
            activeTab === 'obsidian'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900/60'
          }`}
        >
          <Network className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          <span>{isFa ? 'همگام‌سازی Obsidian' : 'Obsidian Sync'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zotero')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
            activeTab === 'zotero'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>{isFa ? 'اتصال Zotero & RIS' : 'Zotero Integration'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coding')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
            activeTab === 'coding'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-900/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900/60'
          }`}
        >
          <Tag className="w-4 h-4 text-pink-500 dark:text-pink-400" />
          <span>{isFa ? 'کدگذاری و تحلیل متن' : 'Text Coding & Analysis'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('parser')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
            activeTab === 'parser'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900/60'
          }`}
        >
          <Split className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span>{isFa ? 'تجزیه‌گر اسناد' : 'Document Splitter'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
            activeTab === 'appearance'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900/60'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{isFa ? 'تنظیمات ظاهری' : 'Appearance'}</span>
        </button>
      </div>

      {/* DATA & BACKUPS TAB */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              SQLite / JSON Local Database Backup & Restore
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Legal Knowledge Hub stores all laws, cases, treatises, and research notes locally in local persistence (<code className="font-mono text-emerald-600 dark:text-emerald-400">data/legal_knowledge.db</code>). You can download a full backup or restore from a previously exported file at any time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Export Knowledge Base</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Save all current records, notes, and category schemas as a backup JSON file.
                </p>
                <button
                  type="button"
                  onClick={onExportJSON}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Restore Database</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select a previously exported JSON backup file to restore records.
                </p>
                <label className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 w-fit cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Upload & Restore</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Reset Seed Data */}
          <div className="p-6 bg-white dark:bg-slate-900/90 border border-rose-300 dark:border-rose-900/40 rounded-2xl space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Reset Knowledge Base to Seed Demo Data
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Resets all records to the default demo legal dataset (laws, cases, books, articles, journals, databases, universities, AI tools, projects, notes).
            </p>
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to reset all data to initial seed demo records?')) {
                  onResetSeedData();
                }
              }}
              className="px-4 py-2 bg-rose-50 dark:bg-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-200 border border-rose-200 dark:border-rose-700/50 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset to Demo Seed Data</span>
            </button>
          </div>
        </div>
      )}

      {/* ARCHITECTURE & STORAGE DIRECTORIES TAB */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Category Directories Configuration Section */}
          <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {isFa ? 'تعیین مسیرهای ذخیره‌سازی محلی فایل‌ها (Local Directories)' : 'Category File Storage Directory Config'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFa
                ? 'شما می‌توانید برای هر دسته‌بندی (نظیر کتاب‌ها، قوانین، آرا، مقالات و...) یک مسیر مجزای سیستم‌عامل (مانند D:\\LegalBooks یا /home/user/books) تعیین کنید تا فایل‌های متنی و پی‌دی‌اف به‌جای ذخیره درون پروژه، مستقیماً در این پوشه‌ها نگهداری شوند.'
                : 'Define absolute host system folders (e.g. D:\\Books or /home/docs/laws) for each category so that attached PDF and document files are referenced directly from your disk rather than inside the workspace.'}
            </p>

            <div className="space-y-3 pt-2">
              {catList.map((cat) => {
                const currentDir =
                  localSettings.categoryDirectories?.[cat.slug] || cat.storagePath || '';

                return (
                  <div
                    key={`dir-${cat.id}`}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 sm:w-1/3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-200">{cat.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">({cat.slug})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:w-2/3">
                      <input
                        type="text"
                        dir="ltr"
                        placeholder={
                          isFa
                            ? 'مسیر سیستم‌عامل (مثلاً: D:\\LegalData\\Books)'
                            : 'OS Path (e.g., C:\\Data\\Books or /var/books)'
                        }
                        value={currentDir}
                        onChange={(e) => {
                          const val = e.target.value;
                          // update in localSettings
                          const updatedDirs = {
                            ...localSettings.categoryDirectories,
                            [cat.slug]: val,
                          };
                          handleSettingsChange('categoryDirectories', updatedDirs);

                          // update in category list
                          const updatedCats = catList.map((c) =>
                            c.id === cat.id ? { ...c, storagePath: val } : c
                          );
                          setCatList(updatedCats);
                          onSaveCategories(updatedCats);
                        }}
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {isFa ? 'مدیریت دسته‌بندی‌های نوار کناری' : 'Custom Category Manager'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isFa
                ? 'امکان تغییر نام، افزودن دسته‌بندی جدید یا حذف دسته‌بندی‌های سفارشی.'
                : 'Customize the sidebar categories. You can add new legal categories or manage existing ones.'}
            </p>

            {/* Add New Category Form */}
            <form onSubmit={handleAddCategory} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isFa ? 'افزودن دسته‌بندی جدید به منو:' : 'Add New Sidebar Category'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder={isFa ? 'نام دسته‌بندی (مثال: حقوق مالیاتی)' : 'Category Name (e.g. Tax Laws)'}
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                />
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono"
                >
                  <option value="Folder">Folder Icon</option>
                  <option value="Scale">Scale (Laws)</option>
                  <option value="Gavel">Gavel (Cases)</option>
                  <option value="BookOpen">Book (Treatise)</option>
                  <option value="FileText">File (Articles)</option>
                  <option value="Database">Database</option>
                  <option value="Building2">University</option>
                  <option value="Bot">AI Tool</option>
                  <option value="FolderKanban">Project</option>
                </select>
                <input
                  type="text"
                  placeholder={isFa ? 'توضیح کوتاه' : 'Short Description'}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isFa ? 'افزودن به نوار کناری' : 'Add Category to Sidebar'}</span>
              </button>
            </form>

            {/* List Existing Categories */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                {isFa ? 'دسته‌بندی‌های فعال' : 'Existing Sidebar Categories'}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {catList.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{cat.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">slug: {cat.slug}</span>
                        {cat.isSystem && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                            System
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{cat.description}</p>
                    </div>

                    {!cat.isSystem && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OBSIDIAN VAULT SYNC TAB */}
      {activeTab === 'obsidian' && <ObsidianSyncConfig language={language} />}

      {/* ZOTERO INTEGRATION TAB */}
      {activeTab === 'zotero' && <ZoteroIntegrationConfig language={language} />}

      {/* TEXT CODING & ANALYSIS TAB */}
      {activeTab === 'coding' && <TextCodingAnalysisModule language={language} />}

      {/* DOCUMENT PARSER TAB */}
      {activeTab === 'parser' && (
        <DocumentSplitterModule
          language={language}
          onImportSplitArticles={onImportSplitArticles}
        />
      )}

      {/* APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            {isFa ? 'تنظیمات ظاهری و پوسته شب / روز' : 'UI Appearance & Theme Settings'}
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1.5">
                {isFa ? 'حالت پوسته (Theme Mode):' : 'Theme Mode:'}
              </label>
              <div className="flex gap-3">
                <div
                  className="px-4 py-2 rounded-xl border flex items-center gap-2 font-medium bg-blue-600/20 text-blue-400 border-blue-500 font-bold"
                >
                  <Moon className="w-4 h-4 text-purple-400" />
                  <span>{isFa ? 'حالت شب (Night Mode - دائم فعال)' : 'Night Mode (Permanent)'}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-mono mb-1">
                {isFa ? 'تراکم چیدمان UI:' : 'UI Density Mode:'}
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleSettingsChange('density', 'comfortable')}
                  className={`px-4 py-2 rounded-xl border cursor-pointer ${
                    localSettings.density === 'comfortable'
                      ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400 border-blue-500'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Comfortable (Spacious Padding)
                </button>
                <button
                  type="button"
                  onClick={() => handleSettingsChange('density', 'compact')}
                  className={`px-4 py-2 rounded-xl border cursor-pointer ${
                    localSettings.density === 'compact'
                      ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400 border-blue-500'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Compact (High Information Density)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-mono mb-1">
                {isFa ? 'رنگ شاخص سامانه:' : 'Accent Highlight Color'}
              </label>
              <div className="flex gap-3">
                {[
                  { name: 'Sapphire Blue', hex: '#3b82f6' },
                  { name: 'Emerald Green', hex: '#10b981' },
                  { name: 'Amethyst Violet', hex: '#8b5cf6' },
                  { name: 'Amber Gold', hex: '#f59e0b' },
                ].map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => handleSettingsChange('accentColor', color.hex)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
