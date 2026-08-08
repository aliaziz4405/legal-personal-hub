import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Edit2,
  Check,
  ChevronDown,
  ChevronRight,
  ListTodo,
  Sparkles,
  Calendar,
  AlertCircle,
  Tag,
  FolderPlus,
  Filter,
} from 'lucide-react';
import { AppLanguage, TaskItem, SubtaskItem } from '../types';
import { translations } from '../i18n/translations';

interface TaskBoardModuleProps {
  language?: AppLanguage;
}

const LOCAL_STORAGE_KEY_TASKS = 'legal_hub_tasks_v1';

const INITIAL_DEMO_TASKS: TaskItem[] = [
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
      { id: 'st-1-4', title: 'استخراج چالش‌های مربوط به بطلان شرط یا عقد', completed: false },
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
      { id: 'st-2-2', title: 'مقایسه مهلت‌های قانونی واخواست در تهران و شهرستان‌ها', completed: true },
    ],
    createdAt: '2026-02-08T11:00:00Z',
    updatedAt: '2026-02-08T11:00:00Z',
  },
  {
    id: 'task-3',
    title: 'همگام‌سازی کتابخانه Zotero و فایل‌های RIS با یادداشت‌های پژوهشی',
    description: 'وارد کردن مقالات و کتب جدید حقوق بین‌الملل و تنظیم برچسب‌ها',
    completed: false,
    priority: 'low',
    dueDate: '2026-03-10',
    category: 'مدیریت منابع',
    subtasks: [
      { id: 'st-3-1', title: 'دانلود فایل‌های .ris از ژورنال‌های انتشارات دانشگاه آکسفورد', completed: true },
      { id: 'st-3-2', title: 'استخراج چکیده و شناسه DOI مقالات جدید', completed: false },
      { id: 'st-3-3', title: 'دسته‌بندی در پوشه‌های موضوعی', completed: false },
    ],
    createdAt: '2026-02-08T12:00:00Z',
    updatedAt: '2026-02-08T12:00:00Z',
  },
];

export const TaskBoardModule: React.FC<TaskBoardModuleProps> = ({ language = 'fa' }) => {
  const t = translations[language] || translations.fa;
  const isFa = language === 'fa';

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_TASKS;
    } catch {
      return INITIAL_DEMO_TASKS;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  // Expanded Tasks UI state
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({
    'task-1': true,
    'task-2': false,
    'task-3': true,
  });

  // Form states for New Task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Form states for New Subtasks per task
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<Record<string, string>>({});

  // Inline Edit states
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Filter states: 'all' | 'pending' | 'completed' and selectedCategory
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Available unique categories extracted from tasks
  const availableCategories = useMemo(() => {
    const catMap: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t.category && t.category.trim()) {
        const catName = t.category.trim();
        catMap[catName] = (catMap[catName] || 0) + 1;
      }
    });
    return Object.entries(catMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [tasks]);

  // Toggle Collapse
  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // Helper to compute task progress percentage
  const getTaskProgress = (task: TaskItem): number => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return task.completed ? 100 : 0;
    }
    const completedCount = task.subtasks.filter((st) => st.completed).length;
    return Math.round((completedCount / task.subtasks.length) * 100);
  };

  // Overall Board Progress
  const overallProgress = useMemo(() => {
    if (tasks.length === 0) return 0;
    let totalSubtasks = 0;
    let completedSubtasks = 0;

    tasks.forEach((t) => {
      if (!t.subtasks || t.subtasks.length === 0) {
        totalSubtasks += 1;
        if (t.completed) completedSubtasks += 1;
      } else {
        totalSubtasks += t.subtasks.length;
        completedSubtasks += t.subtasks.filter((st) => st.completed).length;
      }
    });

    if (totalSubtasks === 0) return 0;
    return Math.round((completedSubtasks / totalSubtasks) * 100);
  }, [tasks]);

  // Overall completed counts
  const totalTaskCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => getTaskProgress(t) === 100).length;

  // Toggle Task Completion Checkbox
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newCompleted = !t.completed;
        // If task has subtasks, set all subtasks to match parent state
        const updatedSubtasks = (t.subtasks || []).map((st) => ({
          ...st,
          completed: newCompleted,
        }));
        return {
          ...t,
          completed: newCompleted,
          subtasks: updatedSubtasks,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Toggle Subtask Completion Checkbox
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const allCompleted =
          updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);

        return {
          ...t,
          subtasks: updatedSubtasks,
          completed: allCompleted,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Add New Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined,
      category: newTaskCategory.trim() || undefined,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setExpandedTasks((prev) => ({ ...prev, [newTask.id]: true }));
    setNewTaskTitle('');
    setNewTaskCategory('');
    setNewTaskDueDate('');
  };

  // Add New Subtask to a Task
  const handleAddSubtask = (taskId: string) => {
    const title = (newSubtaskTitle[taskId] || '').trim();
    if (!title) return;

    const newSubtask: SubtaskItem = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      completed: false,
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = [...(t.subtasks || []), newSubtask];
        return {
          ...t,
          subtasks: updatedSubtasks,
          completed: false, // Adding uncompleted subtask un-completes task
          updatedAt: new Date().toISOString(),
        };
      })
    );

    setNewSubtaskTitle((prev) => ({ ...prev, [taskId]: '' }));
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Delete Subtask
  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.filter((st) => st.id !== subtaskId);
        const allCompleted =
          updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
        return {
          ...t,
          subtasks: updatedSubtasks,
          completed: allCompleted,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Start Renaming/Editing
  const startEditing = (id: string, currentTitle: string) => {
    setEditingItemId(id);
    setEditingTitle(currentTitle);
  };

  // Save Renamed Item (Task or Subtask)
  const saveRename = (taskId: string, subtaskId?: string) => {
    if (!editingTitle.trim()) {
      setEditingItemId(null);
      return;
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;

        if (subtaskId) {
          // Renaming subtask
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, title: editingTitle.trim() } : st
          );
          return { ...t, subtasks: updatedSubtasks, updatedAt: new Date().toISOString() };
        } else {
          // Renaming main task
          return { ...t, title: editingTitle.trim(), updatedAt: new Date().toISOString() };
        }
      })
    );

    setEditingItemId(null);
    setEditingTitle('');
  };

  // Filtered Tasks list
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const progress = getTaskProgress(t);
      if (filter === 'pending' && progress === 100) return false;
      if (filter === 'completed' && progress < 100) return false;

      if (selectedCategory !== 'all') {
        if (!t.category || t.category.trim().toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }, [tasks, filter, selectedCategory]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {isFa ? 'میز مدیریت تکالیف و پروژه‌های پژوهشی' : 'Research Tasks Board & Workflow'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa
                ? 'مدیریت فهرست کارهای حقوقی، تفکیک به زیرمجموعه‌ها، محاسبه درصد پیشرفت و قابلیت تغییر نام کلیه عناصر.'
                : 'Task checklist, subtask breakdown, automated progress calculation, and item renaming.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFa ? 'همه تکالیف' : 'All Tasks'} ({totalTaskCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFa ? 'در حال انجام' : 'In Progress'} ({totalTaskCount - completedTasksCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'completed'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFa ? 'تکمیل‌شده' : 'Completed'} ({completedTasksCount})
          </button>
        </div>
      </div>

      {/* Overall Progress Widget */}
      <div className="p-5 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>{isFa ? 'درصد پیشرفت کل پروژه‌ها و زیرتکالیف:' : 'Overall Board Completion Progress:'}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-blue-600 dark:text-blue-400">
            <span className="text-sm font-bold">{overallProgress}%</span>
            <span className="text-slate-500">
              ({completedTasksCount} / {totalTaskCount} {isFa ? 'تکلیف اصلی' : 'tasks'})
            </span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Add New Parent Task Form */}
      <form onSubmit={handleAddTask} className="p-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-xs">
        <h3 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <FolderPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{isFa ? 'افزودن تکلیف یا پروژه جدید:' : 'Add New Task or Research Activity:'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            type="text"
            dir="auto"
            placeholder={isFa ? 'عنوان تکلیف اصلی (مثال: بررسی آرای دیوان عدالت اداری)...' : 'Task title (e.g., Review Supreme Court precedent)...'}
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="md:col-span-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="text"
            dir="auto"
            placeholder={isFa ? 'دسته‌بندی (مثال: حقوق جزا)' : 'Category/Tag'}
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
            className="md:col-span-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
          />

          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as any)}
            className="md:col-span-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-800 dark:text-slate-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="low">{isFa ? 'اولیت: کم' : 'Priority: Low'}</option>
            <option value="medium">{isFa ? 'اولیت: متوسط' : 'Priority: Med'}</option>
            <option value="high">{isFa ? 'اولیت: بالا' : 'Priority: High'}</option>
          </select>

          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="md:col-span-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isFa ? 'افزودن' : 'Add'}</span>
          </button>
        </div>
      </form>

      {/* Category Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isFa ? 'فیلتر بر اساس دسته‌بندی:' : 'Filter Tasks by Category:'}
            </span>
            {selectedCategory !== 'all' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                #{selectedCategory}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium cursor-pointer"
              >
                {isFa ? 'پاک‌کردن فیلتر دسته‌بندی' : 'Clear Category Filter'}
              </button>
            )}

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500/60 cursor-pointer"
            >
              <option value="all">{isFa ? 'همه دسته‌بندی‌ها' : 'All Categories'} ({tasks.length})</option>
              {availableCategories.map(({ name, count }) => (
                <option key={name} value={name}>
                  {name} ({count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {isFa ? 'همه دسته‌ها' : 'All Categories'} ({tasks.length})
          </button>

          {availableCategories.map(({ name, count }) => {
            const isSelected = selectedCategory.toLowerCase() === name.toLowerCase();
            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? 'all' : name)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-500/40 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>#{name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-purple-800 text-purple-100'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-xs shadow-xs">
            {isFa ? 'هیچ تکلیفی در این بخش یافت نشد.' : 'No tasks found in this view.'}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const taskProgress = getTaskProgress(task);
            const isExpanded = !!expandedTasks[task.id];
            const isEditingTask = editingItemId === task.id;

            return (
              <div
                key={task.id}
                className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl transition-all shadow-xs overflow-hidden"
              >
                {/* Parent Task Bar */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/80">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Expand/Collapse Button */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(task.id)}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 shrink-0 cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Task Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className="text-blue-600 dark:text-blue-500 hover:text-blue-500 shrink-0 cursor-pointer"
                    >
                      {taskProgress === 100 ? (
                        <div className="p-0.5 bg-blue-600 text-white rounded">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      )}
                    </button>

                    {/* Title & Editing */}
                    {isEditingTask ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          dir="auto"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="bg-white dark:bg-slate-950 border border-blue-500 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 flex-1 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => saveRename(task.id)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => startEditing(task.id, task.title)}
                            className={`text-xs font-bold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate ${
                              taskProgress === 100
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                            title={isFa ? 'برای تغییر نام کلیک کنید' : 'Click to rename'}
                          >
                            {task.title}
                          </span>

                          {task.category && (
                            <button
                              type="button"
                              onClick={() => setSelectedCategory(selectedCategory.toLowerCase() === task.category?.toLowerCase() ? 'all' : task.category || 'all')}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 transition-colors cursor-pointer ${
                                selectedCategory.toLowerCase() === task.category.toLowerCase()
                                  ? 'bg-purple-600 text-white font-bold'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700/60'
                              }`}
                              title={isFa ? `فیلتر بر اساس ${task.category}` : `Filter by ${task.category}`}
                            >
                              #{task.category}
                            </button>
                          )}

                          {task.priority && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 uppercase font-bold ${
                                task.priority === 'high'
                                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800/60'
                                  : task.priority === 'medium'
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/60'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {task.priority}
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Task Actions & Progress Bar */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {/* Progress Badge */}
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 dark:bg-slate-950 rounded-full h-2 border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${taskProgress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 min-w-[36px] text-right">
                        {taskProgress}%
                      </span>
                    </div>

                    {/* Rename Button */}
                    {!isEditingTask && (
                      <button
                        type="button"
                        onClick={() => startEditing(task.id, task.title)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title={isFa ? 'تغییر نام عنوان تکلیف' : 'Rename task'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete Task Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title={isFa ? 'حذف تکلیف' : 'Delete task'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtasks Panel */}
                {isExpanded && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                    <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between">
                      <span>
                        {isFa ? 'زیرتکالیف و مراحل اجرایی:' : 'Subtasks & Action Steps:'} (
                        {task.subtasks.filter((st) => st.completed).length} / {task.subtasks.length}
                        )
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                        {isFa ? 'برای تغییر نام هر زیرتکلیف روی متن آن کلیک کنید.' : 'Click subtask text to rename.'}
                      </span>
                    </div>

                    {/* Subtask list */}
                    <div className="space-y-2">
                      {task.subtasks.map((st) => {
                        const isEditingSubtask = editingItemId === st.id;

                        return (
                          <div
                            key={st.id}
                            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {/* Subtask Checkbox */}
                              <button
                                type="button"
                                onClick={() => handleToggleSubtask(task.id, st.id)}
                                className="text-blue-600 dark:text-blue-500 hover:text-blue-500 shrink-0 cursor-pointer"
                              >
                                {st.completed ? (
                                  <div className="p-0.5 bg-blue-600 text-white rounded">
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                                )}
                              </button>

                              {/* Subtask Title & Rename */}
                              {isEditingSubtask ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="text"
                                    dir="auto"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-950 border border-blue-500 rounded px-2 py-0.5 text-xs text-slate-900 dark:text-slate-100 flex-1 focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => saveRename(task.id, st.id)}
                                    className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() => startEditing(st.id, st.title)}
                                  className={`font-medium cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate ${
                                    st.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  {st.title}
                                </span>
                              )}
                            </div>

                            {/* Subtask controls */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {!isEditingSubtask && (
                                <button
                                  type="button"
                                  onClick={() => startEditing(st.id, st.title)}
                                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteSubtask(task.id, st.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Subtask Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        dir="auto"
                        placeholder={
                          isFa
                            ? 'افزودن مرحله/زیرتکلیف جدید (کلید اینتر را بفشارید)...'
                            : 'Add new subtask (press Enter)...'
                        }
                        value={newSubtaskTitle[task.id] || ''}
                        onChange={(e) =>
                          setNewSubtaskTitle((prev) => ({ ...prev, [task.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubtask(task.id);
                          }
                        }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 flex-1 focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSubtask(task.id)}
                        disabled={!(newSubtaskTitle[task.id] || '').trim()}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isFa ? 'افزودن زیرتکلیف' : 'Add Subtask'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
