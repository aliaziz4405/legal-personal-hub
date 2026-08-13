import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_WIDGETS,
  SEED_RESOURCES,
} from './src/data/seedData';
import { AnyLegalResource, AppSettings, CategoryDefinition, DashboardWidget } from './src/types';

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_JSON_PATH = path.join(DATA_DIR, 'legal_knowledge.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBStore {
  resources: AnyLegalResource[];
  categories: CategoryDefinition[];
  widgets: DashboardWidget[];
  settings: AppSettings;
}

function loadDB(): DBStore {
  try {
    if (fs.existsSync(DB_JSON_PATH)) {
      const raw = fs.readFileSync(DB_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      const loadedCats: CategoryDefinition[] = parsed.categories || [];
      
      // Merge any missing initial categories like cat-tasks or cat-manual
      const mergedCats = [...loadedCats];
      for (const initCat of INITIAL_CATEGORIES) {
        if (!mergedCats.some((c) => c.slug === initCat.slug)) {
          mergedCats.push(initCat);
        }
      }

      return {
        resources: parsed.resources || SEED_RESOURCES,
        categories: mergedCats.length > 0 ? mergedCats : INITIAL_CATEGORIES,
        widgets: parsed.widgets || INITIAL_WIDGETS,
        settings: parsed.settings || INITIAL_SETTINGS,
      };
    }
  } catch (err) {
    console.error('Error loading DB from file, resetting to seed:', err);
  }

  // Initial seed setup
  const initialStore: DBStore = {
    resources: SEED_RESOURCES,
    categories: INITIAL_CATEGORIES,
    widgets: INITIAL_WIDGETS,
    settings: INITIAL_SETTINGS,
  };
  saveDB(initialStore);
  return initialStore;
}

function saveDB(store: DBStore) {
  try {
    fs.writeFileSync(DB_JSON_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

let db = loadDB();

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));

  // --- API ROUTES ---

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      appName: 'Legal Knowledge Hub',
      offline: true,
      dbLocation: 'data/legal_knowledge.json',
      totalResources: db.resources.length,
    });
  });

  // Resources CRUD
  app.get('/api/resources', (req: Request, res: Response) => {
    let items = [...db.resources];
    const category = req.query.category as string;
    const search = (req.query.search as string || '').toLowerCase().trim();
    const favoritesOnly = req.query.favorites === 'true';

    if (category && category !== 'dashboard' && category !== 'sitemap' && category !== 'settings') {
      if (category === 'bookmarks') {
        items = items.filter((r) => r.favorite);
      } else {
        items = items.filter((r) => r.category === category);
      }
    }

    if (favoritesOnly) {
      items = items.filter((r) => r.favorite);
    }

    if (search) {
      items = items.filter((r) => {
        const titleMatch = r.title.toLowerCase().includes(search);
        const descMatch = (r.description || '').toLowerCase().includes(search);
        const notesMatch = (r.notes || '').toLowerCase().includes(search);
        const tagsMatch = r.tags.some((t) => t.toLowerCase().includes(search));
        const customMatch = JSON.stringify(r).toLowerCase().includes(search);
        return titleMatch || descMatch || notesMatch || tagsMatch || customMatch;
      });
    }

    res.json({ resources: items });
  });

  app.post('/api/resources', (req: Request, res: Response) => {
    const newRes = req.body as AnyLegalResource;
    if (!newRes.id) {
      newRes.id = `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
    const now = new Date().toISOString();
    newRes.createdAt = newRes.createdAt || now;
    newRes.updatedAt = now;

    db.resources.unshift(newRes);
    saveDB(db);
    res.status(201).json({ resource: newRes });
  });

  app.put('/api/resources/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = db.resources.findIndex((r) => r.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    const updated = {
      ...db.resources[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    db.resources[idx] = updated;
    saveDB(db);
    res.json({ resource: updated });
  });

  app.delete('/api/resources/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialCount = db.resources.length;
    db.resources = db.resources.filter((r) => r.id !== id);

    if (db.resources.length === initialCount) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    saveDB(db);
    res.json({ success: true, deletedId: id });
  });

  // Categories CRUD & Custom Architecture
  app.get('/api/categories', (_req: Request, res: Response) => {
    res.json({ categories: db.categories });
  });

  app.put('/api/categories', (req: Request, res: Response) => {
    if (Array.isArray(req.body.categories)) {
      db.categories = req.body.categories;
      saveDB(db);
      res.json({ categories: db.categories });
    } else {
      res.status(400).json({ error: 'Invalid categories payload' });
    }
  });

  // Dashboard Widgets
  app.get('/api/widgets', (_req: Request, res: Response) => {
    res.json({ widgets: db.widgets });
  });

  app.put('/api/widgets', (req: Request, res: Response) => {
    if (Array.isArray(req.body.widgets)) {
      db.widgets = req.body.widgets;
      saveDB(db);
      res.json({ widgets: db.widgets });
    } else {
      res.status(400).json({ error: 'Invalid widgets payload' });
    }
  });

  // Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json({ settings: db.settings });
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    db.settings = { ...db.settings, ...req.body };
    saveDB(db);
    res.json({ settings: db.settings });
  });

  // Export Data (JSON)
  app.get('/api/export', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="legal_knowledge_backup.json"');
    res.send(JSON.stringify(db, null, 2));
  });

  // Import Data
  app.post('/api/import', (req: Request, res: Response) => {
    try {
      const importedData = req.body;
      if (importedData && Array.isArray(importedData.resources)) {
        db = {
          resources: importedData.resources,
          categories: importedData.categories || db.categories,
          widgets: importedData.widgets || db.widgets,
          settings: importedData.settings || db.settings,
        };
        saveDB(db);
        res.json({ success: true, totalResources: db.resources.length });
      } else {
        res.status(400).json({ error: 'Invalid data format. Expected resources array.' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to process import data' });
    }
  });

  // Reset to Seed Data
  app.post('/api/reset-seed', (_req: Request, res: Response) => {
    db = {
      resources: SEED_RESOURCES,
      categories: INITIAL_CATEGORIES,
      widgets: INITIAL_WIDGETS,
      settings: INITIAL_SETTINGS,
    };
    saveDB(db);
    res.json({ success: true, message: 'Reset to initial seed data successfully' });
  });

  // Open Local File
  app.post('/api/open-file', (req: Request, res: Response) => {
    const { filePath } = req.body;
    if (!filePath || typeof filePath !== 'string') {
      res.status(400).json({ error: 'File path required' });
      return;
    }

    // Command to open local file depending on OS
    const platform = process.platform;
    let command = '';
    if (platform === 'win32') {
      command = `start "" "${filePath}"`;
    } else if (platform === 'darwin') {
      command = `open "${filePath}"`;
    } else {
      command = `xdg-open "${filePath}"`;
    }

    exec(command, (err) => {
      if (err) {
        // Return clear status explaining browser/OS local file protocol
        res.json({
          success: false,
          filePath,
          message: `Attempted OS launch. Note: In browser environments, direct local file launching depends on OS file permissions. File path copied to clipboard.`,
          error: err.message,
        });
      } else {
        res.json({ success: true, message: `Opened ${filePath} on local system` });
      }
    });
  });

  // --- VITE MIDDLEWARE / PRODUCTION SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  let currentPort = PORT;
  let hostsToTry = ['0.0.0.0', '127.0.0.1'];
  let currentHostIndex = 0;

  const tryListen = () => {
    const host = hostsToTry[currentHostIndex] || '127.0.0.1';
    const server = http.createServer(app);

    server.on('error', (err: any) => {
      if (err.code === 'EACCES' || err.code === 'EADDRINUSE') {
        if (currentHostIndex < hostsToTry.length - 1) {
          console.warn(`⚠️ Warning: Could not bind to ${host}:${currentPort} (${err.code}). Trying ${hostsToTry[currentHostIndex + 1]}...`);
          currentHostIndex++;
          tryListen();
        } else if (currentPort < PORT + 10) {
          currentPort++;
          currentHostIndex = 0;
          console.warn(`⚠️ Warning: Port occupied/restricted. Trying next port ${currentPort}...`);
          tryListen();
        } else {
          console.error(`❌ Could not bind to any port between ${PORT} and ${currentPort} (${err.code}).`);
        }
      } else {
        console.error('Server startup error:', err);
      }
    });

    server.listen(currentPort, host, () => {
      console.log(`\n==================================================`);
      console.log(` 🎉 Legal Knowledge Hub is LIVE!`);
      console.log(` 🌐 Local Access:   http://localhost:${currentPort}`);
      if (host === '0.0.0.0') {
        console.log(` 📡 Network Access: http://<YOUR_IP>:${currentPort}`);
      }
      console.log(`==================================================\n`);
    });
  };

  tryListen();
}

startServer();
