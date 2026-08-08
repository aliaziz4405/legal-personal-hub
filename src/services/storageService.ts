import {
  AnyLegalResource,
  AppSettings,
  CategoryDefinition,
  DashboardWidget,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_WIDGETS,
  SEED_RESOURCES,
} from '../data/seedData';

const LOCAL_STORAGE_KEY_RESOURCES = 'legal_hub_resources_v1';
const LOCAL_STORAGE_KEY_CATEGORIES = 'legal_hub_categories_v1';
const LOCAL_STORAGE_KEY_WIDGETS = 'legal_hub_widgets_v1';
const LOCAL_STORAGE_KEY_SETTINGS = 'legal_hub_settings_v1';

// Helper to check if backend server is available
async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

// Client Local Storage Fallback
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

export const storageService = {
  // Fetch All Resources
  async getResources(category?: string, search?: string): Promise<AnyLegalResource[]> {
    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const queryParams = new URLSearchParams();
        if (category) queryParams.set('category', category);
        if (search) queryParams.set('search', search);

        const res = await fetch(`/api/resources?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setLocal(LOCAL_STORAGE_KEY_RESOURCES, data.resources);
          return data.resources;
        }
      }
    } catch (e) {
      console.warn('Backend unavailable, fallback to local storage', e);
    }

    // Fallback
    let items: AnyLegalResource[] = getLocal(LOCAL_STORAGE_KEY_RESOURCES, SEED_RESOURCES);
    if (category && category !== 'dashboard' && category !== 'sitemap' && category !== 'settings') {
      if (category === 'bookmarks') {
        items = items.filter((r) => r.favorite);
      } else {
        items = items.filter((r) => r.category === category);
      }
    }
    if (search) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q) ||
          (r.notes || '').toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return items;
  },

  // Save/Create Resource
  async createResource(resource: Partial<AnyLegalResource>): Promise<AnyLegalResource> {
    const now = new Date().toISOString();
    const newRes = {
      ...resource,
      id: resource.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: resource.createdAt || now,
      updatedAt: now,
      tags: resource.tags || [],
      favorite: !!resource.favorite,
    } as AnyLegalResource;

    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const res = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRes),
        });
        if (res.ok) {
          const data = await res.json();
          return data.resource;
        }
      }
    } catch (e) {
      console.warn('Backend error during create, updating client cache', e);
    }

    // Local Storage Fallback
    const current = getLocal<AnyLegalResource[]>(LOCAL_STORAGE_KEY_RESOURCES, SEED_RESOURCES);
    const updated = [newRes, ...current];
    setLocal(LOCAL_STORAGE_KEY_RESOURCES, updated);
    return newRes;
  },

  // Update Resource
  async updateResource(id: string, updates: Partial<AnyLegalResource>): Promise<AnyLegalResource> {
    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const res = await fetch(`/api/resources/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          const data = await res.json();
          return data.resource;
        }
      }
    } catch (e) {
      console.warn('Backend error during update', e);
    }

    // Local Storage Fallback
    const current = getLocal<AnyLegalResource[]>(LOCAL_STORAGE_KEY_RESOURCES, SEED_RESOURCES);
    const updatedList = current.map((item) =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    );
    setLocal(LOCAL_STORAGE_KEY_RESOURCES, updatedList);
    return updatedList.find((i) => i.id === id) as AnyLegalResource;
  },

  // Delete Resource
  async deleteResource(id: string): Promise<boolean> {
    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
        if (res.ok) return true;
      }
    } catch (e) {
      console.warn('Backend error during delete', e);
    }

    const current = getLocal<AnyLegalResource[]>(LOCAL_STORAGE_KEY_RESOURCES, SEED_RESOURCES);
    const filtered = current.filter((item) => item.id !== id);
    setLocal(LOCAL_STORAGE_KEY_RESOURCES, filtered);
    return true;
  },

  // Categories
  async getCategories(): Promise<CategoryDefinition[]> {
    let cats: CategoryDefinition[] = INITIAL_CATEGORIES;
    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          cats = data.categories || INITIAL_CATEGORIES;
          setLocal(LOCAL_STORAGE_KEY_CATEGORIES, cats);
        }
      } else {
        cats = getLocal(LOCAL_STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
      }
    } catch (e) {
      console.warn('Categories server error', e);
      cats = getLocal(LOCAL_STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
    }

    // Always ensure INITIAL_CATEGORIES like tasks and manual exist
    const merged = [...cats];
    for (const initCat of INITIAL_CATEGORIES) {
      if (!merged.some((c) => c.slug === initCat.slug)) {
        merged.push(initCat);
      }
    }
    return merged;
  },

  async saveCategories(categories: CategoryDefinition[]): Promise<CategoryDefinition[]> {
    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const res = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categories }),
        });
        if (res.ok) {
          const data = await res.json();
          return data.categories;
        }
      }
    } catch (e) {
      console.warn('Save categories server error', e);
    }
    setLocal(LOCAL_STORAGE_KEY_CATEGORIES, categories);
    return categories;
  },

  // Widgets
  async getWidgets(): Promise<DashboardWidget[]> {
    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const res = await fetch('/api/widgets');
        if (res.ok) {
          const data = await res.json();
          setLocal(LOCAL_STORAGE_KEY_WIDGETS, data.widgets);
          return data.widgets;
        }
      }
    } catch (e) {
      console.warn('Widgets server error', e);
    }
    return getLocal(LOCAL_STORAGE_KEY_WIDGETS, INITIAL_WIDGETS);
  },

  async saveWidgets(widgets: DashboardWidget[]): Promise<DashboardWidget[]> {
    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const res = await fetch('/api/widgets', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ widgets }),
        });
        if (res.ok) {
          const data = await res.json();
          return data.widgets;
        }
      }
    } catch (e) {
      console.warn('Save widgets server error', e);
    }
    setLocal(LOCAL_STORAGE_KEY_WIDGETS, widgets);
    return widgets;
  },

  // Settings
  async getSettings(): Promise<AppSettings> {
    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setLocal(LOCAL_STORAGE_KEY_SETTINGS, data.settings);
          return data.settings;
        }
      }
    } catch (e) {
      console.warn('Settings server error', e);
    }
    return getLocal(LOCAL_STORAGE_KEY_SETTINGS, INITIAL_SETTINGS);
  },

  async saveSettings(settings: AppSettings): Promise<AppSettings> {
    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        });
        if (res.ok) {
          const data = await res.json();
          return data.settings;
        }
      }
    } catch (e) {
      console.warn('Save settings server error', e);
    }
    setLocal(LOCAL_STORAGE_KEY_SETTINGS, settings);
    return settings;
  },

  // Reset to Demo Seed Data
  async resetToSeedData(): Promise<boolean> {
    try {
      const isServerUp = await checkBackendHealth();
      if (isServerUp) {
        const res = await fetch('/api/reset-seed', { method: 'POST' });
        if (res.ok) return true;
      }
    } catch (e) {
      console.warn('Reset seed server error', e);
    }
    setLocal(LOCAL_STORAGE_KEY_RESOURCES, SEED_RESOURCES);
    setLocal(LOCAL_STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
    setLocal(LOCAL_STORAGE_KEY_WIDGETS, INITIAL_WIDGETS);
    setLocal(LOCAL_STORAGE_KEY_SETTINGS, INITIAL_SETTINGS);
    return true;
  },

  // Export Data Dump
  async exportDataJSON(): Promise<string> {
    const resources = await this.getResources();
    const categories = await this.getCategories();
    const widgets = await this.getWidgets();
    const settings = await this.getSettings();

    const dump = {
      exportDate: new Date().toISOString(),
      appName: 'Legal Knowledge Hub',
      resources,
      categories,
      widgets,
      settings,
    };
    return JSON.stringify(dump, null, 2);
  },

  // Open Local File Helper
  async openLocalFile(filePath: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/open-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Open file server call error', e);
    }

    // Fallback: copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(filePath);
      return {
        success: true,
        message: `Copied file path to clipboard: ${filePath} (Use local file manager to view)`,
      };
    }
    return {
      success: false,
      message: `File path: ${filePath}`,
    };
  },
};
