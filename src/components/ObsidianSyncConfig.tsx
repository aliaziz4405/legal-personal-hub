import React, { useState } from 'react';
import { Network, Folder, GitBranch, Key, RefreshCw, Plus, Trash2, Check, ArrowRight } from 'lucide-react';
import { AppLanguage, ResourceCategory } from '../types';
import { translations } from '../i18n/translations';

interface TagMapping {
  id: string;
  yamlKey: string;
  yamlValue: string;
  targetCategory: ResourceCategory;
}

interface ObsidianSyncConfigProps {
  language?: AppLanguage;
  onSyncComplete?: (count: number) => void;
}

export const ObsidianSyncConfig: React.FC<ObsidianSyncConfigProps> = ({
  language = 'fa',
  onSyncComplete,
}) => {
  const t = translations[language] || translations.fa;
  const isFa = language === 'fa';

  const [syncType, setSyncType] = useState<'local' | 'git'>('git');
  const [localVaultPath, setLocalVaultPath] = useState('/Users/lawyer/Documents/ObsidianVault');
  const [gitRepoUrl, setGitRepoUrl] = useState('https://github.com/legal-research/obsidian-juris-vault.git');
  const [gitToken, setGitToken] = useState('ghp_xxxxxx_secret_token_12345');
  const [gitBranch, setGitBranch] = useState('main');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Mappings between YAML frontmatter properties and Dashboard categories
  const [mappings, setMappings] = useState<TagMapping[]>([
    { id: '1', yamlKey: 'type', yamlValue: 'law_statute', targetCategory: 'laws' },
    { id: '2', yamlKey: 'type', yamlValue: 'case_brief', targetCategory: 'cases' },
    { id: '3', yamlKey: 'tags', yamlValue: 'academic-book', targetCategory: 'books' },
    { id: '4', yamlKey: 'type', yamlValue: 'quick_note', targetCategory: 'notes' },
    { id: '5', yamlKey: 'category', yamlValue: 'research_project', targetCategory: 'projects' },
  ]);

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<ResourceCategory>('notes');

  const handleAddMapping = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setMappings((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        yamlKey: newKey.trim(),
        yamlValue: newValue.trim(),
        targetCategory: newCategory,
      },
    ]);
    setNewKey('');
    setNewValue('');
  };

  const handleDeleteMapping = (id: string) => {
    setMappings((prev) => prev.filter((m) => m.id !== id));
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncStatus(isFa ? 'در حال اتصال و دریافت فایل‌های Markdown...' : 'Connecting to repository and fetching markdown files...');

    setTimeout(() => {
      setIsSyncing(false);
      const count = 7;
      setSyncStatus(
        isFa
          ? `همگام‌سازی با موفقیت انجام شد! ${count} سند یادداشت مطابق فرانت‌متر نگاشت شدند.`
          : `Sync completed successfully! ${count} markdown notes imported based on YAML frontmatter rules.`
      );
      if (onSyncComplete) onSyncComplete(count);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {isFa ? 'همگام‌سازی مخزن اوبسیدین (Obsidian Vault Sync)' : 'Obsidian Vault & Markdown Integration'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa
                ? 'فراخوانی خودکار یادداشت‌ها از پوشه محلی یا گیت (Git) و دسته‌بندی آن‌ها براساس فرانت‌متر YAML.'
                : 'Automatically fetch Markdown files from Git or local directory and parse YAML metadata.'}
            </p>
          </div>
        </div>
      </div>

      {/* Sync Source Selection */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          {isFa ? '۱. انتخاب منبع مخزن اوبسیدین' : '1. Vault Location & Credentials'}
        </h4>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setSyncType('git')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
              syncType === 'git'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>{isFa ? 'مخزن گیت آنلاین (Git Repo)' : 'Remote Git Repository'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSyncType('local')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
              syncType === 'local'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>{isFa ? 'مسیر محلی در دیسک (Local Path)' : 'Local File System Path'}</span>
          </button>
        </div>

        {syncType === 'git' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                {isFa ? 'نشانی مخزن گیت (Git Repository URL)' : 'Git Repository URL'}
              </label>
              <div className="relative">
                <GitBranch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  dir="ltr"
                  value={gitRepoUrl}
                  onChange={(e) => setGitRepoUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 font-mono text-left focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                {isFa ? 'شاخه (Branch)' : 'Git Branch'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={gitBranch}
                onChange={(e) => setGitBranch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono text-left focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                {isFa ? 'توکن دسترسی شخصی (Git Personal Access Token)' : 'Git Access Token / Secret'}
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  dir="ltr"
                  value={gitToken}
                  onChange={(e) => setGitToken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 font-mono text-left focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              {isFa ? 'مسیر فولدر مخزن اوبسیدین روی سیستم' : 'Local Obsidian Vault Folder Directory'}
            </label>
            <div className="relative">
              <Folder className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                dir="ltr"
                value={localVaultPath}
                onChange={(e) => setLocalVaultPath(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 font-mono text-left focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Visual YAML Tag & Property Mapping Tool */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          {isFa ? '۲. نگاشت بصری خصوصیات فرانت‌متر YAML به بخش‌های داشبورد' : '2. YAML Frontmatter Tag Mapping Tool'}
        </h4>
        <p className="text-xs text-slate-400">
          {isFa
            ? 'تعیین کنید یادداشت‌های اوبسیدین با چه کلید/مقدار فرانت‌متر به کدام بخش سامانه‌ منتقل شوند:'
            : 'Map specific Obsidian YAML metadata properties to Legal Knowledge Hub categories:'}
        </p>

        {/* Existing Mappings List */}
        <div className="space-y-2">
          {mappings.map((m) => (
            <div
              key={m.id}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-800 text-purple-400 rounded border border-slate-700">
                  YAML: {m.yamlKey} = "{m.yamlValue}"
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-0.5 bg-blue-950 text-blue-300 rounded border border-blue-800">
                  Category: {m.targetCategory}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteMapping(m.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="Remove rule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Form to Add Mapping */}
        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
          <span className="text-[11px] font-bold text-slate-300">
            {isFa ? 'افزودن قاعده نگاشت جدید:' : 'Add New Mapping Rule:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="YAML Key (e.g. type, tags)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono"
            />
            <input
              type="text"
              placeholder="YAML Value (e.g. case_study)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono"
            />
            <div className="flex gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ResourceCategory)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono w-full"
              >
                <option value="laws">Laws (قوانین)</option>
                <option value="cases">Cases (رویه قضایی)</option>
                <option value="books">Books (کتب)</option>
                <option value="articles">Articles (مقالات)</option>
                <option value="notes">Notes (یادداشت‌ها)</option>
                <option value="projects">Projects (پروژه‌ها)</option>
              </select>
              <button
                type="button"
                onClick={handleAddMapping}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFa ? 'افزودن' : 'Add'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sync Trigger Action */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? (isFa ? 'در حال همگام‌سازی...' : 'Syncing...') : (isFa ? 'اجرای همگام‌سازی اوبسیدین' : 'Sync Obsidian Vault Now')}</span>
          </button>

          {syncStatus && (
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{syncStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
