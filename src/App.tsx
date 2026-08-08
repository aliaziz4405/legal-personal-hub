import React, { useState, useEffect, useMemo } from 'react';
import {
  AnyLegalResource,
  AppLanguage,
  AppSettings,
  CategoryDefinition,
  DashboardWidget,
  ResourceCategory,
} from './types';
import { storageService } from './services/storageService';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CategoryView } from './components/CategoryView';
import { SitemapView } from './components/SitemapView';
import { SettingsView } from './components/SettingsView';
import { TaskBoardModule } from './components/TaskBoardModule';
import { GuidelineManualView } from './components/GuidelineManualView';
import { ResourceDetailModal } from './components/ResourceDetailModal';
import { ResourceFormModal } from './components/ResourceFormModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ToastNotification } from './components/ToastNotification';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<ResourceCategory>('dashboard');
  const [categories, setCategories] = useState<CategoryDefinition[]>([]);
  const [resources, setResources] = useState<AnyLegalResource[]>([]);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [language, setLanguage] = useState<AppLanguage>('fa');
  const [settings, setSettings] = useState<AppSettings>({
    themeMode: 'dark',
    accentColor: '#3b82f6',
    density: 'comfortable',
    sidebarWidth: 260,
    dbLocation: 'data/legal_knowledge.db',
    animationIntensity: 'normal',
    autoSaveIntervalMs: 5000,
    language: 'fa',
  });

  // UI States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Modal States
  const [selectedResourceDetails, setSelectedResourceDetails] = useState<AnyLegalResource | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<AnyLegalResource | null>(null);
  const [formDefaultCategory, setFormDefaultCategory] = useState<ResourceCategory>('laws');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial Load
  const loadInitialData = async () => {
    const cats = await storageService.getCategories();
    const resList = await storageService.getResources();
    const wids = await storageService.getWidgets();
    const sets = await storageService.getSettings();

    setCategories(cats);
    setResources(resList);
    setWidgets(wids);
    setSettings(sets);
    if (sets.language) {
      setLanguage(sets.language);
    }
  };

  useEffect(() => {
    loadInitialData();
    document.documentElement.classList.add('dark');
  }, []);

  const handleLanguageChange = async (newLang: AppLanguage) => {
    setLanguage(newLang);
    const updatedSettings = { ...settings, language: newLang };
    setSettings(updatedSettings);
    await storageService.saveSettings(updatedSettings);
    setToastMessage(newLang === 'fa' ? 'زبان برنامه به فارسی تغییر یافت' : 'Language switched to English');
  };

  // Category counts map
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {
      dashboard: resources.length,
      bookmarks: resources.filter((r) => r.favorite).length,
    };
    resources.forEach((r) => {
      map[r.category] = (map[r.category] || 0) + 1;
    });
    return map;
  }, [resources]);

  // CRUD Handlers
  const handleToggleFavorite = async (id: string, currentFav: boolean) => {
    const updated = await storageService.updateResource(id, { favorite: !currentFav });
    setResources((prev) => prev.map((r) => (r.id === id ? updated : r)));
    if (selectedResourceDetails && selectedResourceDetails.id === id) {
      setSelectedResourceDetails(updated);
    }
    setToastMessage(!currentFav ? (language === 'fa' ? 'به موارد نشان‌شده اضافه شد ★' : 'Added to bookmarked items ★') : (language === 'fa' ? 'از نشان‌شده‌ها حذف شد' : 'Removed from bookmarks'));
  };

  const handleSaveResource = async (resData: Partial<AnyLegalResource>) => {
    if (editingResource) {
      const updated = await storageService.updateResource(editingResource.id, resData);
      setResources((prev) => prev.map((r) => (r.id === editingResource.id ? updated : r)));
      setToastMessage(language === 'fa' ? 'اطلاعات با موفقیت بروزرسانی شد' : 'Record updated successfully');
    } else {
      const created = await storageService.createResource(resData);
      setResources((prev) => [created, ...prev]);
      setToastMessage(language === 'fa' ? 'منبع جدید در پایگاه ثبت شد' : 'New legal record created in repository');
    }
    setEditingResource(null);
  };

  const handleDeleteResource = async (id: string, title: string) => {
    const confirmMsg = language === 'fa'
      ? `آیا از حذف دائم "${title}" از پایگاه دانش اطمینان دارید؟`
      : `Delete "${title}" permanently from local knowledge base?`;
    if (confirm(confirmMsg)) {
      await storageService.deleteResource(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      if (selectedResourceDetails?.id === id) {
        setSelectedResourceDetails(null);
      }
      setToastMessage(language === 'fa' ? 'منبع از پایگاه داده حذف گردید' : 'Record deleted from database');
    }
  };

  // Open File Action
  const handleOpenFile = async (filePath: string) => {
    const res = await storageService.openLocalFile(filePath);
    setToastMessage(res.message);
  };

  // Quick Actions Modals
  const handleOpenNewResource = (cat?: ResourceCategory) => {
    setEditingResource(null);
    setFormDefaultCategory(cat || 'laws');
    setIsFormModalOpen(true);
  };

  const handleOpenQuickNote = () => {
    setEditingResource(null);
    setFormDefaultCategory('notes');
    setIsFormModalOpen(true);
  };

  const handleEditResource = (res: AnyLegalResource) => {
    setEditingResource(res);
    setFormDefaultCategory(res.category);
    setIsFormModalOpen(true);
  };

  // Export / Import
  const handleExportJSON = async () => {
    const jsonStr = await storageService.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal_knowledge_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage(language === 'fa' ? 'فایل پشتیبان دانلود شد' : 'Backup file downloaded');
  };

  const handleImportJSON = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.resources && Array.isArray(parsed.resources)) {
          setResources(parsed.resources);
          if (parsed.categories) setCategories(parsed.categories);
          await storageService.resetToSeedData(); // updates local
          setToastMessage(language === 'fa' ? 'پایگاه داده از فایل پشتیبان بازگردانی شد' : 'Database restored successfully from backup');
        } else {
          alert(language === 'fa' ? 'فرمت فایل پشتیبان معتبر نیست.' : 'Invalid backup format. File must contain resources array.');
        }
      } catch (err) {
        alert(language === 'fa' ? 'خطا در خوندن فایل پشتیبان JSON.' : 'Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSeed = async () => {
    await storageService.resetToSeedData();
    await loadInitialData();
    setToastMessage(language === 'fa' ? 'داده‌های پایگاه به حالت اولیه بازگردانده شدند' : 'Database reset to initial seed demo dataset');
  };

  // Category Definition Updates
  const handleSaveCategories = async (newCats: CategoryDefinition[]) => {
    const saved = await storageService.saveCategories(newCats);
    setCategories(saved);
    setToastMessage(language === 'fa' ? 'ساختار دسته‌بندی‌ها ذخیره شد' : 'Sidebar categories architecture updated');
  };

  const handleSaveSettings = async (newSettings: AppSettings) => {
    const saved = await storageService.saveSettings(newSettings);
    setSettings(saved);
    if (newSettings.language && newSettings.language !== language) {
      setLanguage(newSettings.language);
    }
    setToastMessage(language === 'fa' ? 'تنظیمات ذخیره گردید' : 'Settings saved');
  };

  // Resources belonging to current view
  const currentCategoryObj = categories.find((c) => c.slug === currentCategory);

  const handleImportSplitArticles = async (articles: Partial<AnyLegalResource>[]) => {
    for (const art of articles) {
      const created = await storageService.createResource(art);
      setResources((prev) => [created, ...prev]);
    }
    setToastMessage(
      language === 'fa'
        ? `تعداد ${articles.length} ماده با موفقیت به پایگاه قوانین اضافه گردید`
        : `Successfully imported ${articles.length} articles into laws repository`
    );
  };

  return (
    <div 
      dir={language === 'fa' ? 'rtl' : 'ltr'}
      className={`min-h-screen flex flex-col antialiased transition-colors duration-300 selection:bg-blue-600 selection:text-white bg-slate-950 text-slate-100 ${
        language === 'fa' ? 'font-vazir' : 'font-times'
      }`}
    >
      {/* Top Navigation Bar */}
      <TopBar
        currentCategory={currentCategory}
        categories={categories}
        language={language}
        onLanguageChange={handleLanguageChange}
        onSelectCategory={(cat) => setCurrentCategory(cat)}
        onOpenNewResource={handleOpenNewResource}
        onOpenQuickNote={handleOpenQuickNote}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        onToggleSidebarMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        searchQuery={globalSearchQuery}
        onSearchChange={(q) => {
          setGlobalSearchQuery(q);
          if (q.trim()) setIsGlobalSearchOpen(true);
        }}
      />

      {/* Main Workspace Area (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          categories={categories}
          currentCategory={currentCategory}
          language={language}
          onSelectCategory={(cat) => setCurrentCategory(cat)}
          categoryCounts={categoryCounts}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {currentCategory === 'dashboard' && (
            <DashboardView
              resources={resources}
              widgets={widgets}
              language={language}
              onSelectCategory={(cat) => setCurrentCategory(cat)}
              onOpenNewResource={handleOpenNewResource}
              onOpenQuickNote={handleOpenQuickNote}
              onOpenDetails={(res) => setSelectedResourceDetails(res)}
              onToggleFavorite={handleToggleFavorite}
              onExportJSON={handleExportJSON}
            />
          )}

          {currentCategory === 'sitemap' && (
            <SitemapView
              categories={categories}
              language={language}
              onSelectCategory={(cat) => setCurrentCategory(cat)}
              categoryCounts={categoryCounts}
            />
          )}

          {currentCategory === 'tasks' && (
            <TaskBoardModule language={language} />
          )}

          {currentCategory === 'manual' && (
            <GuidelineManualView language={language} />
          )}

          {currentCategory === 'settings' && (
            <SettingsView
              settings={settings}
              categories={categories}
              language={language}
              onLanguageChange={handleLanguageChange}
              onSaveSettings={handleSaveSettings}
              onSaveCategories={handleSaveCategories}
              onExportJSON={handleExportJSON}
              onImportJSON={handleImportJSON}
              onResetSeedData={handleResetSeed}
              onImportSplitArticles={handleImportSplitArticles}
            />
          )}

          {currentCategory !== 'dashboard' &&
            currentCategory !== 'sitemap' &&
            currentCategory !== 'settings' &&
            currentCategory !== 'tasks' &&
            currentCategory !== 'manual' && (
              <CategoryView
                categorySlug={currentCategory}
                categoryObj={currentCategoryObj}
                language={language}
                resources={
                  currentCategory === 'bookmarks'
                    ? resources.filter((r) => r.favorite)
                    : resources.filter((r) => r.category === currentCategory)
                }
                onOpenNewResource={handleOpenNewResource}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetails={(res) => setSelectedResourceDetails(res)}
                onEdit={handleEditResource}
                onDelete={handleDeleteResource}
                onOpenFile={handleOpenFile}
              />
            )}
        </main>
      </div>

      {/* MODALS */}
      <ResourceDetailModal
        resource={selectedResourceDetails}
        language={language}
        onClose={() => setSelectedResourceDetails(null)}
        onEdit={handleEditResource}
        onDelete={handleDeleteResource}
        onToggleFavorite={handleToggleFavorite}
        onOpenFile={handleOpenFile}
      />

      <ResourceFormModal
        isOpen={isFormModalOpen}
        language={language}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingResource(null);
        }}
        onSave={handleSaveResource}
        initialResource={editingResource}
        categories={categories}
        defaultCategory={formDefaultCategory}
      />

      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        language={language}
        onClose={() => {
          setIsGlobalSearchOpen(false);
          setGlobalSearchQuery('');
        }}
        resources={resources}
        onSelectResource={(res) => setSelectedResourceDetails(res)}
      />

      {/* TOAST NOTIFICATION */}
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

