export type ResourceCategory =
  | 'dashboard'
  | 'laws'
  | 'cases'
  | 'books'
  | 'articles'
  | 'journals'
  | 'databases'
  | 'universities'
  | 'ai_tools'
  | 'projects'
  | 'notes'
  | 'bookmarks'
  | 'sitemap'
  | 'settings'
  | string; // Allows custom user categories

export type ReadingStatus = 'Not started' | 'Reading' | 'Finished' | 'To read' | 'Reference only';

export type ProjectStatus = 'Idea' | 'Planning' | 'Researching' | 'Drafting' | 'Reviewing' | 'Completed' | 'Archived';

export interface BaseResource {
  id: string;
  category: ResourceCategory;
  title: string;
  description?: string;
  notes?: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  localFilePath?: string;
  sourceUrl?: string;
}

export interface LawResource extends BaseResource {
  category: 'laws';
  shortTitle?: string;
  jurisdiction: string;
  legalSystem?: string;
  date?: string;
  issuingAuthority?: string;
  lawNumber?: string;
  citation?: string;
  subject?: string;
}

export interface CaseResource extends BaseResource {
  category: 'cases';
  caseNumber?: string;
  court: string;
  jurisdiction: string;
  date?: string;
  judges?: string;
  parties?: string;
  legalIssue?: string;
  decision?: string;
  legalPrinciple?: string;
  citation?: string;
  keywords?: string;
  source?: string;
}

export interface BookResource extends BaseResource {
  category: 'books';
  author: string;
  editor?: string;
  publisher?: string;
  publicationYear?: number | string;
  edition?: string;
  isbn?: string;
  language?: string;
  subject?: string;
  rating?: number;
  readingStatus: ReadingStatus;
  externalReference?: string;
}

export interface ArticleResource extends BaseResource {
  category: 'articles';
  authors: string;
  journal: string;
  publicationYear?: number | string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  abstract?: string;
  subject?: string;
  readingStatus: ReadingStatus;
}

export interface JournalResource extends BaseResource {
  category: 'journals';
  issn?: string;
  publisher?: string;
  discipline?: string;
  country?: string;
  website?: string;
  databaseIndex?: string;
}

export interface LegalDatabaseResource extends BaseResource {
  category: 'databases';
  provider?: string;
  type?: string;
  subjects?: string;
  accessInfo?: string;
}

export interface UniversityResource extends BaseResource {
  category: 'universities';
  universityName: string;
  country: string;
  city?: string;
  faculty?: string;
  lawSchool?: string;
  website?: string;
  researchAreas?: string;
  researchers?: string;
}

export interface AiToolResource extends BaseResource {
  category: 'ai_tools';
  toolName: string;
  provider?: string;
  purpose?: string;
  toolCategory?: string;
  features?: string;
  isLocalOnly?: boolean;
}

export interface ProjectResource extends BaseResource {
  category: 'projects';
  researchQuestion?: string;
  researchProblem?: string;
  hypothesis?: string;
  methodology?: string;
  status: ProjectStatus;
  startDate?: string;
  deadline?: string;
  relatedLaws?: string[];
  relatedCases?: string[];
  relatedBooks?: string[];
  relatedArticles?: string[];
  references?: string;
}

export interface NoteResource extends BaseResource {
  category: 'notes';
  content: string;
  relatedResourceIds?: string[];
}

export interface CustomResource extends BaseResource {
  customFields?: Record<string, string>;
}

export type AnyLegalResource =
  | LawResource
  | CaseResource
  | BookResource
  | ArticleResource
  | JournalResource
  | LegalDatabaseResource
  | UniversityResource
  | AiToolResource
  | ProjectResource
  | NoteResource
  | CustomResource;

export interface CategoryDefinition {
  id: string;
  name: string;
  slug: ResourceCategory;
  icon: string;
  description: string;
  badgeCount?: number;
  parentId?: string | null;
  order: number;
  isSystem?: boolean;
  subcategories?: { id: string; name: string; slug: string }[];
  storagePath?: string; // Custom OS directory path for storing files in this category
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'stats' | 'recent' | 'favorites' | 'projects' | 'quick_notes' | 'quick_actions';
  enabled: boolean;
  order: number;
}

export type AppLanguage = 'en' | 'fa';

export interface SubtaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
  subtasks?: SubtaskItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  language: AppLanguage;
  themeMode: 'dark' | 'light';
  accentColor: string; // e.g. '#3b82f6' (blue), '#10b981' (emerald), '#8b5cf6' (violet), '#f59e0b' (amber), '#d97706' (gold)
  density: 'comfortable' | 'compact';
  sidebarWidth: number; // in px, e.g., 260
  dbLocation: string; // e.g. 'data/legal_knowledge.db'
  categoryDirectories?: Record<string, string>; // Local storage folder path per category (e.g. books: 'D:/Books')
  animationIntensity: 'normal' | 'reduced';
  autoSaveIntervalMs: number;
}

export type ViewMode = 'card' | 'compact' | 'table';

export interface FilterOptions {
  searchQuery: string;
  tags: string[];
  jurisdiction?: string;
  subject?: string;
  status?: string;
  readingStatus?: string;
  favoritesOnly: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface SortOptions {
  field: 'title' | 'createdAt' | 'updatedAt' | 'date' | 'publicationYear';
  direction: 'asc' | 'desc';
}
