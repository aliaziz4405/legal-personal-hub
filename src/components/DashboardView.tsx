import React, { useState, useEffect, useMemo } from 'react';
import {
  Scale,
  Gavel,
  BookOpen,
  FileText,
  Newspaper,
  Database,
  FolderKanban,
  Star,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Download,
  CheckCircle2,
  StickyNote,
  CheckSquare,
  Square,
  Tag,
  X,
  Search,
  ExternalLink,
  ListTodo,
  AlertCircle,
} from 'lucide-react';
import { AnyLegalResource, AppLanguage, DashboardWidget, ResourceCategory, TaskItem } from '../types';
import { translations, getCategoryName, getStatusTranslation } from '../i18n/translations';

interface DashboardViewProps {
  resources: AnyLegalResource[];
  widgets: DashboardWidget[];
  language: AppLanguage;
  onSelectCategory: (cat: ResourceCategory) => void;
  onOpenNewResource: (cat?: ResourceCategory) => void;
  onOpenQuickNote: () => void;
  onOpenDetails: (res: AnyLegalResource) => void;
  onToggleFavorite: (id: string, fav: boolean) => void;
  onExportJSON: () => void;
}

const LOCAL_STORAGE_KEY_TASKS = 'legal_hub_tasks_v1';

export const DashboardView: React.FC<DashboardViewProps> = ({
  resources,
  widgets,
  language,
  onSelectCategory,
  onOpenNewResource,
  onOpenQuickNote,
  onOpenDetails,
  onToggleFavorite,
  onExportJSON,
}) => {
  const t = translations[language];
  const isFa = language === 'fa';

  // --- TASKS BOARD STATE ---
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'task-1',
        title: 'بررسی فقهی و حقوقی ماده ۱۰ قانون مدنی و اصل آزادی قراردادها',
        description: 'تحلیل تطبیقی با شروط خلاف مقتضای ذات عقد در نظام حقوقی ایران',
        completed: false,
        priority: 'high',
        dueDate: '2026-03-01',
        category: 'حقوق مدنی',
        subtasks: [
          { id: 'st-1-1', title: 'مطالعه آراء دیوان عالی کشور در خصوص شروط نامشروع', completed: true },
          { id: 'st-1-2', title: 'بررسی نظریات دکترین حقوقی (دکتر کاتوزیان و دکتر امامی)', completed: true },
          { id: 'st-1-3', title: 'نگارش یادداشت تحلیلی و ثبت در سیستم نوت‌برداری', completed: false },
        ],
        createdAt: '2026-02-08T10:00:00Z',
        updatedAt: '2026-02-08T10:00:00Z',
      },
      {
        id: 'task-2',
        title: 'ارزیابی رای وحدت رویه شماره ۸۳۵ دیوان عالی کشور در خصوص اسناد تجاری',
        description: 'استخراج رویه قضایی دادگاه‌های تجاری در زمینه واخواست چک',
        completed: true,
        priority: 'medium',
        dueDate: '2026-02-20',
        category: 'اسناد تجاری',
        subtasks: [
          { id: 'st-2-1', title: 'بررسی نص ماده ۳۱۵ قانون تجارت', completed: true },
        ],
        createdAt: '2026-02-08T11:00:00Z',
        updatedAt: '2026-02-08T11:00:00Z',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  const [quickTaskTitle, setQuickTaskTitle] = useState('');

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((tk) =>
        tk.id === taskId ? { ...tk, completed: !tk.completed, updatedAt: new Date().toISOString() } : tk
      )
    );
  };

  const handleAddQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: quickTaskTitle.trim(),
      completed: false,
      priority: 'medium',
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setQuickTaskTitle('');
  };

  const completedTasksCount = tasks.filter((tk) => tk.completed).length;
  const totalTasksCount = tasks.length;
  const taskProgressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // --- TAGS FREQUENCY STATE ---
  const [selectedTagModal, setSelectedTagModal] = useState<string | null>(null);
  const [tagSearchQuery, setTagSearchQuery] = useState('');

  const tagCounts = useMemo(() => {
    const map: Record<string, number> = {};
    resources.forEach((r) => {
      (r.tags || []).forEach((t) => {
        const clean = t.trim().toLowerCase();
        if (clean) {
          map[clean] = (map[clean] || 0) + 1;
        }
      });
    });
    return Object.entries(map)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [resources]);

  const filteredTagCounts = tagCounts.filter((tc) =>
    tc.tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  const tagAssociatedResources = useMemo(() => {
    if (!selectedTagModal) return [];
    const q = selectedTagModal.toLowerCase();
    return resources.filter((r) =>
      (r.tags || []).some((t) => t.trim().toLowerCase() === q)
    );
  }, [selectedTagModal, resources]);

  // Counts breakdown
  const stats = {
    laws: resources.filter((r) => r.category === 'laws').length,
    cases: resources.filter((r) => r.category === 'cases').length,
    books: resources.filter((r) => r.category === 'books').length,
    articles: resources.filter((r) => r.category === 'articles').length,
    journals: resources.filter((r) => r.category === 'journals').length,
    databases: resources.filter((r) => r.category === 'databases').length,
    projects: resources.filter((r) => r.category === 'projects').length,
    tasks: totalTasksCount,
    favorites: resources.filter((r) => r.favorite).length,
  };

  const recentResources = [...resources]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const favoriteResources = resources.filter((r) => r.favorite).slice(0, 5);
  const projects = resources.filter((r) => r.category === 'projects');

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Overview Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-mono font-bold text-blue-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t.appTitle} - {t.overviewTitle}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              {isFa ? 'سامانه و پایگاه مدیریت پژوهش‌های حقوقی' : 'Personal Legal Repository & Knowledge Manager'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {isFa 
                ? 'پایگاه آفلاین محلی برای مدیریت قوانین، رویه قضایی، کتب مرجع، مقالات تخصصی، تکالیف و پروژه‌های تحلیلی.'
                : 'Local offline platform for managing acts, judicial precedents, treatises, law articles, task boards, and empirical research projects.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onExportJSON}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>{t.exportBackupAction}</span>
            </button>
            <button
              onClick={() => onOpenNewResource()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/40 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addRecord}</span>
            </button>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW WIDGET GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {[
          { key: 'laws', label: getCategoryName('laws', language, 'Laws & Acts'), count: stats.laws, icon: Scale, color: 'text-amber-400 bg-amber-400/10 border-amber-500/20' },
          { key: 'cases', label: getCategoryName('cases', language, 'Judicial Decisions'), count: stats.cases, icon: Gavel, color: 'text-blue-400 bg-blue-400/10 border-blue-500/20' },
          { key: 'books', label: getCategoryName('books', language, 'Books & Treatises'), count: stats.books, icon: BookOpen, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' },
          { key: 'articles', label: getCategoryName('articles', language, 'Scholarly Articles'), count: stats.articles, icon: FileText, color: 'text-purple-400 bg-purple-400/10 border-purple-500/20' },
          { key: 'journals', label: getCategoryName('journals', language, 'Academic Journals'), count: stats.journals, icon: Newspaper, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-500/20' },
          { key: 'databases', label: getCategoryName('databases', language, 'Legal Databases'), count: stats.databases, icon: Database, color: 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20' },
          { key: 'tasks', label: getCategoryName('tasks', language, 'Tasks Board'), count: stats.tasks, icon: CheckSquare, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' },
          { key: 'projects', label: getCategoryName('projects', language, 'Research Projects'), count: stats.projects, icon: FolderKanban, color: 'text-orange-400 bg-orange-400/10 border-orange-500/20' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => onSelectCategory(item.key as ResourceCategory)}
              className="p-4 bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-xl cursor-pointer transition-all hover:scale-[1.02] group flex items-center justify-between shadow-xs"
            >
              <div>
                <p className="text-[11px] font-mono text-slate-400 font-medium group-hover:text-slate-200 transition-colors">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-slate-100 mt-1 font-mono">{item.count}</p>
              </div>
              <div className={`p-2.5 rounded-xl border ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* TWO COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Tasks Board, Active Projects, Recent Activity */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. TASKS BOARD SECTION ON DASHBOARD */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 tracking-wide flex items-center gap-2">
                    <span>{getCategoryName('tasks', language, 'Tasks Board')}</span>
                    <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {completedTasksCount}/{totalTasksCount} {isFa ? 'تکمیل شده' : 'done'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isFa ? 'مدیریت وظایف پژوهشی، لایحه‌نویسی و کارهای حقوقی' : 'Research assignments, litigation tasks & checklist'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectCategory('tasks')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20"
              >
                <span>{isFa ? 'مشاهده کامل تابلوی تکالیف' : 'Open Tasks Board'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isFa ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Task Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>{isFa ? 'پیشرفت کلی تکالیف' : 'Overall Progress'}</span>
                <span className="text-emerald-400 font-bold">{taskProgressPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${taskProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                  {isFa ? 'هیچ تکلیفی ثبت نشده است. از فرم زیر اضافه کنید.' : 'No tasks added yet. Add one below.'}
                </div>
              ) : (
                tasks.slice(0, 5).map((tk) => {
                  const completedSubtasks = tk.subtasks?.filter((s) => s.completed).length || 0;
                  const totalSubtasks = tk.subtasks?.length || 0;

                  return (
                    <div
                      key={tk.id}
                      className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        tk.completed
                          ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleTask(tk.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                        >
                          {tk.completed ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                        <div className="min-w-0 space-y-1">
                          <h4
                            onClick={() => handleToggleTask(tk.id)}
                            className={`text-xs font-semibold cursor-pointer transition-colors ${
                              tk.completed ? 'line-through text-slate-500' : 'text-slate-200 hover:text-emerald-400'
                            }`}
                          >
                            {tk.title}
                          </h4>
                          {tk.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-1">{tk.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                            {tk.category && (
                              <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded border border-slate-700">
                                {tk.category}
                              </span>
                            )}
                            {tk.priority === 'high' && (
                              <span className="text-red-400 font-bold">{isFa ? 'اولویت بالا' : 'High'}</span>
                            )}
                            {tk.priority === 'medium' && (
                              <span className="text-amber-400">{isFa ? 'اولویت متوسط' : 'Medium'}</span>
                            )}
                            {tk.dueDate && <span>{isFa ? 'مهلت:' : 'Due:'} {tk.dueDate}</span>}
                            {totalSubtasks > 0 && (
                              <span className="text-blue-400">
                                {completedSubtasks}/{totalSubtasks} {isFa ? 'زیرکار' : 'subtasks'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Add Task Input */}
            <form onSubmit={handleAddQuickTask} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder={isFa ? '+ افزودن سریع تکلیف جدید و فشردن Enter...' : '+ Add quick task title and press Enter...'}
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!quickTaskTitle.trim()}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isFa ? 'افزودن' : 'Add'}</span>
              </button>
            </form>
          </div>

          {/* 2. ACTIVE RESEARCH PROJECTS */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                  {t.activeProjectsTitle}
                </h3>
              </div>
              <button
                onClick={() => onSelectCategory('projects')}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>{t.viewAll}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isFa ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                {isFa ? 'هیچ پروژه فعال یا پرونده‌ای ثبت نشده است.' : 'No active research projects.'}
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => {
                  const p = proj as any;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onOpenDetails(p)}
                      className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-xs font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                          {p.title}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-orange-950/60 text-orange-300 border border-orange-800/50 shrink-0">
                          {getStatusTranslation(p.status || 'Researching', language)}
                        </span>
                      </div>
                      {p.researchQuestion && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-2 font-sans leading-relaxed">
                          {isFa ? 'سوال اصلی:' : 'Q:'} {p.researchQuestion}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
                        {p.deadline && <span>{isFa ? 'مهلت:' : 'Deadline:'} {p.deadline}</span>}
                        {p.relatedLaws && <span>{p.relatedLaws.length} {getCategoryName('laws', language)}</span>}
                        {p.relatedCases && <span>{p.relatedCases.length} {getCategoryName('cases', language)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. RECENTLY ADDED RESOURCES */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                  {t.recentAdditionsTitle}
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {recentResources.map((res) => (
                <div
                  key={res.id}
                  onClick={() => onOpenDetails(res)}
                  className="p-3 bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-blue-400 border border-slate-700">
                        {getCategoryName(res.category, language)}
                      </span>
                      <h4 className="text-xs font-medium text-slate-200 group-hover:text-blue-400 truncate">
                        {res.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {res.description || (res as any).content || ''}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(res.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Tags Section, Bookmarks & Quick Actions */}
        <div className="space-y-6">

          {/* TAGS & KEYWORDS FREQUENCY WIDGET */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-pink-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                    {isFa ? 'برچسب‌ها و کلیدواژه‌ها' : 'Tags & Keywords'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {tagCounts.length} {isFa ? 'برچسب منحصربه‌فرد' : 'unique tags'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tag Search Input */}
            <div className="relative">
              <Search className={`w-3.5 h-3.5 text-slate-500 absolute top-1/2 -translate-y-1/2 ${isFa ? 'right-2.5' : 'left-2.5'}`} />
              <input
                type="text"
                placeholder={isFa ? 'فیلتر برچسب‌ها...' : 'Filter tags...'}
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                className={`w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 ${
                  isFa ? 'pr-8 pl-3' : 'pl-8 pr-3'
                }`}
              />
            </div>

            {/* Tag Chips List */}
            {filteredTagCounts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-3">
                {isFa ? 'هیچ برچسبی یافت نشد.' : 'No tags found.'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto custom-scrollbar p-1">
                {filteredTagCounts.map(({ tag, count }) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTagModal(tag)}
                    className="group px-2.5 py-1 bg-slate-950 hover:bg-pink-950/40 border border-slate-800 hover:border-pink-500/40 text-slate-300 hover:text-pink-300 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
                    title={isFa ? `مشاهده ${count} سند مرتبط با ${tag}` : `View ${count} items tagged #${tag}`}
                  >
                    <span>#{tag}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 group-hover:bg-pink-900/60 text-slate-400 group-hover:text-pink-200">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favorites List */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                  {t.favoriteItems}
                </h3>
              </div>
              <button
                onClick={() => onSelectCategory('bookmarks')}
                className="text-xs text-blue-400 hover:underline font-medium cursor-pointer"
              >
                {t.viewAll}
              </button>
            </div>

            {favoriteResources.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 text-center">
                {isFa 
                  ? 'سندی نشان داده نشده است. با کلیک بر روی ستاره در هر سند، آن را به نشان‌شده‌ها اضافه کنید.'
                  : 'No starred items. Click the star icon on any card to add bookmarks here.'}
              </p>
            ) : (
              <div className="space-y-2">
                {favoriteResources.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => onOpenDetails(f)}
                    className="p-2.5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl cursor-pointer group transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 truncate">
                        {f.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">{getCategoryName(f.category, language)}</p>
                    </div>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 shadow-xs">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              {t.quickActionsTitle}
            </h3>

            <button
              onClick={() => onOpenNewResource('laws')}
              className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>+ {isFa ? 'ثبت قانون / مصوبه جدید' : 'Record New Statute / Law'}</span>
            </button>

            <button
              onClick={() => onOpenNewResource('cases')}
              className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Gavel className="w-4 h-4 text-blue-400" />
              <span>+ {isFa ? 'ثبت رای یا رویه قضایی جدید' : 'Record Judicial Decision'}</span>
            </button>

            <button
              onClick={onOpenQuickNote}
              className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <StickyNote className="w-4 h-4 text-emerald-400" />
              <span>+ {t.quickNote}</span>
            </button>

            <button
              onClick={() => onSelectCategory('tasks')}
              className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <CheckSquare className="w-4 h-4 text-pink-400" />
              <span>{isFa ? 'مدیریت کامل تکالیف و پروژه‌ها' : 'Open Full Tasks Board'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAG FILTER MODAL */}
      {selectedTagModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            dir={isFa ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-xl">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>{isFa ? 'اسناد و یادداشت‌های مرتبط با برچسب:' : 'Items Tagged:'}</span>
                    <span className="text-pink-400 font-mono">#{selectedTagModal}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {tagAssociatedResources.length} {isFa ? 'سند یافت شد' : 'items found'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTagModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: List of tagged items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {tagAssociatedResources.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                  {isFa ? 'هیچ سندی با این برچسب یافت نشد.' : 'No items match this tag.'}
                </div>
              ) : (
                tagAssociatedResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                            {getCategoryName(res.category, language)}
                          </span>
                          <h4 className="text-xs font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                            {res.title}
                          </h4>
                        </div>
                        {res.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {res.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTagModal(null);
                          onOpenDetails(res);
                        }}
                        className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                      >
                        <span>{isFa ? 'مشاهده سند' : 'View Item'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/60">
                      {(res.tags || []).map((t) => (
                        <span
                          key={t}
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            t.trim().toLowerCase() === selectedTagModal.toLowerCase()
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold'
                              : 'bg-slate-800/80 text-slate-400'
                          }`}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTagModal(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


