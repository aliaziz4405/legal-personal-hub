import { AppLanguage, ResourceCategory } from '../types';

export interface Translations {
  // Common Navigation
  appTitle: string;
  appSubtitle: string;
  searchPlaceholder: string;
  addRecord: string;
  quickNote: string;
  globalSearch: string;
  language: string;
  english: string;
  farsi: string;
  dashboard: string;
  bookmarks: string;
  sitemap: string;
  settings: string;
  records: string;
  record: string;
  favorites: string;
  viewAll: string;
  close: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  confirmDelete: string;
  actions: string;
  filter: string;
  sort: string;
  allTags: string;
  
  // Dashboard
  totalRecords: string;
  favoriteItems: string;
  researchProjects: string;
  quickNotesCount: string;
  overviewTitle: string;
  quickActionsTitle: string;
  recentAdditionsTitle: string;
  activeProjectsTitle: string;
  quickNotesTitle: string;
  addNoteAction: string;
  exportBackupAction: string;
  resetDemoAction: string;
  openSitemapAction: string;
  systemSettingsAction: string;

  // Categories & Descriptions
  categories: Record<string, { name: string; desc: string }>;

  // Form & Modals
  addRecordTitle: string;
  editRecordTitle: string;
  categoryLabel: string;
  titleLabel: string;
  shortTitleLabel: string;
  descriptionLabel: string;
  notesLabel: string;
  tagsLabel: string;
  localFilePathLabel: string;
  sourceUrlLabel: string;
  jurisdictionLabel: string;
  legalSystemLabel: string;
  dateLabel: string;
  issuingAuthorityLabel: string;
  lawNumberLabel: string;
  citationLabel: string;
  courtLabel: string;
  caseNumberLabel: string;
  judgesLabel: string;
  partiesLabel: string;
  legalIssueLabel: string;
  decisionLabel: string;
  legalPrincipleLabel: string;
  keywordsLabel: string;
  authorLabel: string;
  authorsLabel: string;
  publisherLabel: string;
  publicationYearLabel: string;
  editionLabel: string;
  isbnLabel: string;
  readingStatusLabel: string;
  subjectLabel: string;
  journalLabel: string;
  volumeLabel: string;
  issueLabel: string;
  pagesLabel: string;
  doiLabel: string;
  abstractLabel: string;
  openLocalFile: string;
  visitSource: string;
  copyPath: string;

  // Statuses
  statuses: Record<string, string>;

  // Settings
  settingsHeaderTitle: string;
  settingsHeaderDesc: string;
  dataTab: string;
  architectureTab: string;
  appearanceTab: string;
  languageSelectLabel: string;
  languageSelectDesc: string;
  fontInfoText: string;
  downloadBackupJSON: string;
  uploadRestore: string;
  resetSeedData: string;
  addSidebarCategory: string;
  categoryNamePlaceholder: string;

  // Toast Messages
  toastCreated: string;
  toastUpdated: string;
  toastDeleted: string;
  toastBookmarked: string;
  toastUnbookmarked: string;
  toastReset: string;
  toastRestored: string;
}

export const translations: Record<AppLanguage, Translations> = {
  en: {
    appTitle: 'Legal Knowledge Hub',
    appSubtitle: 'SQLite Legal Research Repository',
    searchPlaceholder: 'Search laws, cases, books, articles... (⌘K)',
    addRecord: 'Add Record',
    quickNote: 'Quick Note',
    globalSearch: 'Global Search',
    language: 'Language',
    english: 'English (Times New Roman)',
    farsi: 'فارسی (Vazirmatn)',
    dashboard: 'Dashboard',
    bookmarks: 'Bookmarks',
    sitemap: 'Architecture Map',
    settings: 'Settings',
    records: 'records',
    record: 'record',
    favorites: 'Favorites',
    viewAll: 'View All',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save Record',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this record permanently?',
    actions: 'Actions',
    filter: 'Filter',
    sort: 'Sort',
    allTags: 'All Tags',

    totalRecords: 'Total Legal Records',
    favoriteItems: 'Bookmarked Items',
    researchProjects: 'Research Projects',
    quickNotesCount: 'Quick Notes',
    overviewTitle: 'Repository Overview & Metrics',
    quickActionsTitle: 'Quick Knowledge Actions',
    recentAdditionsTitle: 'Recent Repository Additions',
    activeProjectsTitle: 'Active Legal Research Projects',
    quickNotesTitle: 'Quick Research Scratchpad',
    addNoteAction: '+ New Note',
    exportBackupAction: 'Export Backup',
    resetDemoAction: 'Reset Demo Data',
    openSitemapAction: 'View Sitemap',
    systemSettingsAction: 'System Config',

    categories: {
      dashboard: { name: 'Dashboard', desc: 'Central overview and analytics of legal knowledge base' },
      laws: { name: 'Laws & Regulations', desc: 'Statutes, codifications, decrees, and administrative rules' },
      cases: { name: 'Judicial Precedents', desc: 'Court judgments, rulings, and legal precedents' },
      books: { name: 'Books & Treatises', desc: 'Monographs, commentaries, and legal textbooks' },
      articles: { name: 'Academic Articles', desc: 'Peer-reviewed articles, law reviews, and essays' },
      journals: { name: 'Legal Periodicals', desc: 'Law journals, periodicals, and academic publications' },
      databases: { name: 'Legal Databases', desc: 'Digital law libraries, portals, and indexes' },
      universities: { name: 'Law Faculties', desc: 'Law schools, research institutes, and academic centers' },
      ai_tools: { name: 'Legal AI Assistants', desc: 'AI research assistants, contract analytics, and LLMs' },
      projects: { name: 'Research Projects', desc: 'Case briefs, academic papers, and litigation prep' },
      tasks: { name: 'Tasks Board', desc: 'To-do items, subtasks breakdown, and task progress management' },
      manual: { name: 'User Guide Manual', desc: 'Comprehensive setup and system guidelines' },
      notes: { name: 'Research Notes', desc: 'Personal annotations, legal commentary, and quick drafts' },
      bookmarks: { name: 'Bookmarks', desc: 'Quick access to all starred resources' },
      sitemap: { name: 'Architecture Map', desc: 'Visual map of legal knowledge hierarchy' },
      settings: { name: 'Settings', desc: 'Application config, backups, language & font settings' },
    },

    addRecordTitle: 'Add New Legal Record',
    editRecordTitle: 'Edit Legal Record',
    categoryLabel: 'Category',
    titleLabel: 'Title / Name',
    shortTitleLabel: 'Short Title / Acronym',
    descriptionLabel: 'Summary / Description',
    notesLabel: 'Detailed Notes & Commentary',
    tagsLabel: 'Tags (comma separated)',
    localFilePathLabel: 'Local File Path',
    sourceUrlLabel: 'Source URL',
    jurisdictionLabel: 'Jurisdiction',
    legalSystemLabel: 'Legal System',
    dateLabel: 'Date / Effective Date',
    issuingAuthorityLabel: 'Issuing Authority',
    lawNumberLabel: 'Law / Act Number',
    citationLabel: 'Citation',
    courtLabel: 'Court / Tribunal',
    caseNumberLabel: 'Case Number',
    judgesLabel: 'Judges / Bench',
    partiesLabel: 'Parties',
    legalIssueLabel: 'Legal Issue',
    decisionLabel: 'Ruling / Decision',
    legalPrincipleLabel: 'Legal Principle',
    keywordsLabel: 'Keywords',
    authorLabel: 'Author',
    authorsLabel: 'Authors',
    publisherLabel: 'Publisher',
    publicationYearLabel: 'Publication Year',
    editionLabel: 'Edition',
    isbnLabel: 'ISBN',
    readingStatusLabel: 'Reading Status',
    subjectLabel: 'Subject / Practice Area',
    journalLabel: 'Journal Name',
    volumeLabel: 'Volume',
    issueLabel: 'Issue',
    pagesLabel: 'Pages',
    doiLabel: 'DOI',
    abstractLabel: 'Abstract',
    openLocalFile: 'Open Local File',
    visitSource: 'Visit Source Link',
    copyPath: 'Copy File Path',

    statuses: {
      'Not started': 'Not started',
      'Reading': 'Reading',
      'Finished': 'Finished',
      'To read': 'To read',
      'Reference only': 'Reference only',
      'Idea': 'Idea',
      'Planning': 'Planning',
      'Researching': 'Researching',
      'Drafting': 'Drafting',
      'Reviewing': 'Reviewing',
      'Completed': 'Completed',
      'Archived': 'Archived',
    },

    settingsHeaderTitle: 'Application Settings & Configuration',
    settingsHeaderDesc: 'Manage database backups, language & font selection, categories, and theme options.',
    dataTab: 'Data & Database Backups',
    architectureTab: 'Sidebar & Categories Architecture',
    appearanceTab: 'Appearance & Language',
    languageSelectLabel: 'Hub Interface Language',
    languageSelectDesc: 'Switch the primary language of the application interface.',
    fontInfoText: 'English uses Times New Roman typography. Farsi (Persian) uses Vazirmatn typography with full Right-to-Left (RTL) layout support.',
    downloadBackupJSON: 'Download Backup JSON',
    uploadRestore: 'Upload & Restore',
    resetSeedData: 'Reset to Demo Seed Data',
    addSidebarCategory: 'Add Category to Sidebar',
    categoryNamePlaceholder: 'Category Name (e.g. Tax Laws)',

    toastCreated: 'New legal record created in repository',
    toastUpdated: 'Record updated successfully',
    toastDeleted: 'Record deleted from database',
    toastBookmarked: 'Added to bookmarked items ★',
    toastUnbookmarked: 'Removed from bookmarks',
    toastReset: 'Database reset to initial seed demo dataset',
    toastRestored: 'Database restored successfully from backup',
  },

  fa: {
    appTitle: 'سامانه جامع دانش حقوقی',
    appSubtitle: 'پایگاه داده و پژوهش‌های حقوقی',
    searchPlaceholder: 'جستجو در قوانین، آراء، کتب، مقالات... (⌘K)',
    addRecord: 'افزودن ثبت جدید',
    quickNote: 'یادداشت سریع',
    globalSearch: 'جستجوی سراسری',
    language: 'زبان سامانه',
    english: 'English (Times New Roman)',
    farsi: 'فارسی (وزیرمتن)',
    dashboard: 'داشبورد مرکزی',
    bookmarks: 'نشان‌شده‌ها',
    sitemap: 'نقشه ساختاری',
    settings: 'تنظیمات سامانه',
    records: 'سند',
    record: 'سند',
    favorites: 'نشان‌شده‌ها',
    viewAll: 'مشاهده همه',
    close: 'بستن',
    cancel: 'انصراف',
    save: 'ذخیره سند',
    edit: 'ویرایش',
    delete: 'حذف',
    confirmDelete: 'آیا از حذف دائمی این سند از پایگاه داده اطمینان دارید؟',
    actions: 'عملیات',
    filter: 'فیلتر',
    sort: 'مرتب‌سازی',
    allTags: 'همه برچسب‌ها',

    totalRecords: 'کل اسناد حقوقی',
    favoriteItems: 'اسناد نشان‌شده',
    researchProjects: 'پروژه‌های پژوهشی',
    quickNotesCount: 'یادداشت‌های سریع',
    overviewTitle: 'نمای کلی و آمار پایگاه دانش',
    quickActionsTitle: 'دسترسی‌های سریع پژوهشی',
    recentAdditionsTitle: 'آخرین اسناد افزوده شده',
    activeProjectsTitle: 'پروژه‌های پژوهشی و پرونده‌های فعال',
    quickNotesTitle: 'یادداشت‌های سریع و فیش‌برداری',
    addNoteAction: '+ یادداشت جدید',
    exportBackupAction: 'پشتیبان‌گیری',
    resetDemoAction: 'بازنشانی داده‌های اولیه',
    openSitemapAction: 'مشاهده نقشه ساختاری',
    systemSettingsAction: 'تنظیمات سامانه',

    categories: {
      dashboard: { name: 'داشبورد مرکزی', desc: 'نمای کلی و آمارهای پایگاه دانش حقوقی' },
      laws: { name: 'قوانین و مقررات', desc: 'قوانین مصوب، آیین‌نامه‌ها، بخشنامه‌ها و اسناد تقنینی' },
      cases: { name: 'آراء و رویه قضایی', desc: 'آراء دیوان عالی، دادگاه‌ها، هیات عمومی و نظریات مشورتی' },
      books: { name: 'کتب و متون حقوقی', desc: 'کتاب‌های مرجع، دکترین حقوقی و متون آموزشی' },
      articles: { name: 'مقالات علمی‌پژوهشی', desc: 'مقالات ژورنالی، تحلیل‌های حقوقی و نقد آراء' },
      journals: { name: 'نشریات تخصصی', desc: 'مجلات تخصصی و فصلنامه‌های علمی حقوقی' },
      databases: { name: 'پایگاه‌های داده', desc: 'سامانه‌ها و بانک‌های اطلاعاتی حقوقی آنلاین' },
      universities: { name: 'دانشکده‌های حقوق', desc: 'دانشکده‌ها، مراکز پژوهشی و کرسی‌های حقوقی' },
      ai_tools: { name: 'ابزارهای هوش مصنوعی', desc: 'ابزارهای هوشمند تحلیل قرارداد، پژوهش و نگارش حقوقی' },
      projects: { name: 'پروژه‌ها و پرونده‌ها', desc: 'دادخواست‌ها، لایحه‌ها، پایان‌نامه‌ها و پروژه‌های تحلیلی' },
      tasks: { name: 'تابلوی تکالیف و پروژه‌ها', desc: 'مدیریت کارها، تکالیف پژوهشی، چک‌لیست‌ها و زیرمجموعه‌ها' },
      manual: { name: 'دفترچه راهنمای کاربر', desc: 'راهنمای جامع کار با سیستم و مراحل نصب' },
      notes: { name: 'یادداشت‌های پژوهشی', desc: 'یادداشت‌های شخصی، فیش‌برداری‌ها و تحلیل‌های سریع' },
      bookmarks: { name: 'نشان‌شده‌ها', desc: 'دسترسی سریع به کلیه اسناد نشان‌شده' },
      sitemap: { name: 'نقشه ساختاری', desc: 'نقشه بصری ساختار درخت داده‌های حقوقی' },
      settings: { name: 'تنظیمات سامانه', desc: 'تنظیمات پایگاه داده، زبان، فونت و ساختار منوها' },
    },

    addRecordTitle: 'افزودن سند حقوقی جدید',
    editRecordTitle: 'ویرایش سند حقوقی',
    categoryLabel: 'دسته‌بندی',
    titleLabel: 'عنوان / نام سند',
    shortTitleLabel: 'عنوان کوتاه / مخفف',
    descriptionLabel: 'خلاصه / توضیحات',
    notesLabel: 'یادداشت‌های تفصیلی و تحلیل',
    tagsLabel: 'برچسب‌ها (با کاما جدا کنید)',
    localFilePathLabel: 'مسیر فایل محلی',
    sourceUrlLabel: 'پیوند منبع آنلاین',
    jurisdictionLabel: 'حوزه قضایی / صلاحیت',
    legalSystemLabel: 'نظام حقوقی',
    dateLabel: 'تاریخ / تاریخ تصویب',
    issuingAuthorityLabel: 'مرجع تصویب / صادرکننده',
    lawNumberLabel: 'شماره قانون / مصوبه',
    citationLabel: 'شماره ثبت / استناد',
    courtLabel: 'دادگاه / مرجع قضایی',
    caseNumberLabel: 'شماره پرونده / رای',
    judgesLabel: 'قضات / هیات دادرسان',
    partiesLabel: 'طرفین دعوی',
    legalIssueLabel: 'مسئله حقوقی / موضوع',
    decisionLabel: 'خلاصه رای / تصمیم',
    legalPrincipleLabel: 'اصل / قاعده حقوقی',
    keywordsLabel: 'کلیدواژه‌ها',
    authorLabel: 'نویسنده',
    authorsLabel: 'نویسندگان',
    publisherLabel: 'ناشر',
    publicationYearLabel: 'سال انتشار',
    editionLabel: 'نوبت چاپ',
    isbnLabel: 'شابک (ISBN)',
    readingStatusLabel: 'وضعیت مطالعه',
    subjectLabel: 'موضوع / گرایش حقوقی',
    journalLabel: 'نام نشریه',
    volumeLabel: 'دوره',
    issueLabel: 'شماره',
    pagesLabel: 'صفحات',
    doiLabel: 'شناسه دیجیتال (DOI)',
    abstractLabel: 'چکیده',
    openLocalFile: 'باز کردن فایل محلی',
    visitSource: 'مشاهده پیوند منبع',
    copyPath: 'کپی مسیر فایل',

    statuses: {
      'Not started': 'شروع‌نشده',
      'Reading': 'در حال مطالعه',
      'Finished': 'مطالعه‌شده',
      'To read': 'برای مطالعه',
      'Reference only': 'فقط مرجع استناد',
      'Idea': 'ایده اولیه',
      'Planning': 'برنامه‌ریزی',
      'Researching': 'در حال پژوهش',
      'Drafting': 'در حال تدوین',
      'Reviewing': 'در حال بازبینی',
      'Completed': 'تکمیل‌شده',
      'Archived': 'آرشیو شده',
    },

    settingsHeaderTitle: 'تنظیمات و پیکربندی سامانه',
    settingsHeaderDesc: 'مدیریت پشتیبان‌گیری، انتخاب زبان و فونت، ساختار منوها و پوسته سامانه.',
    dataTab: 'پشتیبان‌گیری و داده‌ها',
    architectureTab: 'ساختار دسته‌بندی‌ها',
    appearanceTab: 'ظاهر و زبان سامانه',
    languageSelectLabel: 'زبان اصلی رابط کاربری',
    languageSelectDesc: 'تغییر زبان سامانه بین فارسی و انگلیسی با راست‌چین‌سازی کامل.',
    fontInfoText: 'زبان فارسی از فونت وزیرمتن (Vazirmatn) و چیدمان راست‌به‌چپ (RTL) استفاده می‌کند. زبان انگلیسی از فونت تايمز نیو رومن (Times New Roman) و چیدمان چپ‌به‌راست (LTR) استفاده می‌کند.',
    downloadBackupJSON: 'دانلود فایل پشتیبان (JSON)',
    uploadRestore: 'بارگذاری و بازیابی',
    resetSeedData: 'بازنشانی به داده‌های اولیه',
    addSidebarCategory: 'افزودن دسته‌بندی جدید به منو',
    categoryNamePlaceholder: 'نام دسته‌بندی (مثلاً: قوانین مالیاتی)',

    toastCreated: 'سند حقوقی جدید با موفقیت ثبت شد',
    toastUpdated: 'سند حقوقی با موفقیت ویرایش شد',
    toastDeleted: 'سند با موفقیت از پایگاه داده حذف شد',
    toastBookmarked: 'به اسناد نشان‌شده اضافه شد ★',
    toastUnbookmarked: 'از نشان‌شده‌ها حذف شد',
    toastReset: 'پایگاه داده به داده‌های نمونه اولیه بازنشانی شد',
    toastRestored: 'پایگاه داده با موفقیت از فایل پشتیبان بازیابی شد',
  },
};

export function getCategoryName(slug: string, lang: string = 'fa', fallbackName?: string): string {
  const appLang: AppLanguage = (lang === 'en' || lang === 'fa') ? lang : 'fa';
  const tCat = translations[appLang]?.categories[slug];
  if (tCat) return tCat.name;
  return fallbackName || slug;
}

export function getCategoryDesc(slug: string, lang: string = 'fa', fallbackDesc?: string): string {
  const appLang: AppLanguage = (lang === 'en' || lang === 'fa') ? lang : 'fa';
  const tCat = translations[appLang]?.categories[slug];
  if (tCat) return tCat.desc;
  return fallbackDesc || '';
}

export function getStatusTranslation(status: string, lang: string = 'fa'): string {
  const appLang: AppLanguage = (lang === 'en' || lang === 'fa') ? lang : 'fa';
  return translations[appLang]?.statuses[status] || status;
}

