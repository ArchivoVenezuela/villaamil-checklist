import type {
  ChecklistEntry,
  ChecklistTemplate,
  AppSettings,
  ChecklistProgress,
} from '@/types/index'

// ── Storage keys ──────────────────────────────────────────────────────────────

const KEYS = {
  entries: 'villaamil-v11-entries',
  userTemplates: 'villaamil-v11-user-templates',
  settings: 'villaamil-v11-settings',
  migrated: 'villaamil-v11-migrated',
  // legacy v2 prefix for migration
  v2Prefix: 'villaamil-v2',
} as const

// ── Helpers ───────────────────────────────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable — fail silently
  }
}

// ── Entries ───────────────────────────────────────────────────────────────────

export function loadEntries(): ChecklistEntry[] {
  return read<ChecklistEntry[]>(KEYS.entries, [])
}

export function saveEntries(entries: ChecklistEntry[]) {
  write(KEYS.entries, entries)
}

export function loadEntry(id: string): ChecklistEntry | undefined {
  return loadEntries().find((e) => e.id === id)
}

export function saveEntry(entry: ChecklistEntry) {
  const entries = loadEntries()
  const idx = entries.findIndex((e) => e.id === entry.id)
  if (idx >= 0) {
    entries[idx] = entry
  } else {
    entries.push(entry)
  }
  saveEntries(entries)
}

export function deleteEntry(id: string) {
  saveEntries(loadEntries().filter((e) => e.id !== id))
}

// ── User templates ────────────────────────────────────────────────────────────

export function loadUserTemplates(): ChecklistTemplate[] {
  return read<ChecklistTemplate[]>(KEYS.userTemplates, [])
}

export function saveUserTemplates(templates: ChecklistTemplate[]) {
  write(KEYS.userTemplates, templates)
}

export function saveUserTemplate(template: ChecklistTemplate) {
  const templates = loadUserTemplates()
  const idx = templates.findIndex((t) => t.id === template.id)
  if (idx >= 0) {
    templates[idx] = template
  } else {
    templates.push(template)
  }
  saveUserTemplates(templates)
}

export function deleteUserTemplate(id: string) {
  saveUserTemplates(loadUserTemplates().filter((t) => t.id !== id))
}

// ── Settings ──────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  homeName: 'Villaamil',
  defaultRecipients: [],
  language: 'es',
}

export function loadSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<AppSettings>>(KEYS.settings, {}) }
}

export function saveSettings(settings: AppSettings) {
  write(KEYS.settings, settings)
}

// ── Legacy v2 helpers (used only during migration) ────────────────────────────

function v2Key(checklistId: string, suffix: string) {
  return `${KEYS.v2Prefix}-${checklistId}-${suffix}`
}

export function loadLegacyProgress(checklistId: string): ChecklistProgress | null {
  try {
    const checkedRaw = localStorage.getItem(v2Key(checklistId, 'checked'))
    if (!checkedRaw) return null
    return {
      checklistId,
      checked: JSON.parse(checkedRaw) as Record<string, boolean>,
      notes: localStorage.getItem(v2Key(checklistId, 'notes')) ?? '',
      startedAt:
        localStorage.getItem(v2Key(checklistId, 'startedAt')) ?? new Date().toISOString(),
      completedAt: localStorage.getItem(v2Key(checklistId, 'completedAt')),
    }
  } catch {
    return null
  }
}

export function isMigrated(): boolean {
  return localStorage.getItem(KEYS.migrated) === 'true'
}

export function markMigrated() {
  localStorage.setItem(KEYS.migrated, 'true')
}

// ── Legacy v2 functions kept for back-compat (no-ops post-migration) ──────────

export function loadProgress(checklistId: string): ChecklistProgress {
  return {
    checklistId,
    checked: {},
    notes: '',
    startedAt: new Date().toISOString(),
    completedAt: null,
  }
}

export function saveChecked(_id: string, _checked: Record<string, boolean>) {}
export function saveNotes(_id: string, _notes: string) {}
export function saveStartedAt(_id: string, _startedAt: string) {}
export function saveCompletedAt(_id: string, _completedAt: string | null) {}
export function ensureStartedAt(_id: string): string {
  return new Date().toISOString()
}
export function resetProgress(_id: string) {}
