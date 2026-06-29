import type { ChecklistEntry, ChecklistTemplate } from '@/types/index'
import { loadLegacyProgress, isMigrated, markMigrated, loadEntries, saveEntries } from './storage'
import { generateId, todayISO } from './utils'

// Built-in template IDs that may have legacy data
const LEGACY_CHECKLIST_IDS = ['departure', 'return']

/**
 * One-time migration from v2 flat storage to v1.1 entry model.
 * Safe to call on every app start — does nothing if already migrated.
 */
export function migrateStorageIfNeeded(builtInTemplates: ChecklistTemplate[]) {
  if (isMigrated()) return

  const existing = loadEntries()
  const newEntries: ChecklistEntry[] = []

  for (const checklistId of LEGACY_CHECKLIST_IDS) {
    // Don't duplicate if entries already exist for this template
    if (existing.some((e) => e.templateId === checklistId)) continue

    const legacy = loadLegacyProgress(checklistId)
    if (!legacy) continue

    const template = builtInTemplates.find((t) => t.id === checklistId)
    if (!template) continue

    const hasProgress = Object.values(legacy.checked).some(Boolean)
    if (!hasProgress) continue

    const allTaskIds = template.sections.flatMap((s) => s.tasks.map((t) => t.id))
    const checkedCount = allTaskIds.filter((id) => legacy.checked[id]).length
    const isComplete = checkedCount === allTaskIds.length && allTaskIds.length > 0

    const entry: ChecklistEntry = {
      id: generateId(),
      templateId: checklistId,
      title: `${template.title} (migrado)`,
      date: legacy.startedAt ? legacy.startedAt.split('T')[0] : todayISO(),
      createdAt: legacy.startedAt ?? new Date().toISOString(),
      startedAt: legacy.startedAt,
      completedAt: legacy.completedAt ?? undefined,
      status: isComplete ? 'completed' : 'in_progress',
      checkedTasks: legacy.checked,
      notes: legacy.notes || undefined,
    }

    newEntries.push(entry)
  }

  if (newEntries.length > 0) {
    saveEntries([...existing, ...newEntries])
  }

  markMigrated()
}
